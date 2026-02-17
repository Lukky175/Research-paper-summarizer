const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};



const app = express();
app.use(express.json());
app.use(cors());

// --- MongoDB Connection ---
const mongoURI =
  process.env.MONGO_URI ||
  `mongodb://${process.env.MONGO_ROOT_USER}:${process.env.MONGO_ROOT_PASS}@mongo:27017/loginApp?authSource=admin` ||
  "mongodb://127.0.0.1:27017/loginApp";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// --- Schema ---
const UserSchema = new mongoose.Schema({
  username: String,
  name: String,
  phone: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

// --- Gemini API Setup ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Conversation History (in-memory) ---
let conversationHistory = []; // keeps last few user-model exchanges

// --- Auth Routes ---
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Entered password:", password);
    console.log("Stored hash:", user.password);

    const isMatch = await bcrypt.compare(password.trim(), user.password);

    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { username: user.username, email: user.email },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});



app.post("/register", async (req, res) => {
  const { username, name, phone, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      name,
      phone,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
});
// --- Token Validation Endpoint ---
app.get("/validate", authenticateToken, (req, res) => {
  res.status(200).json({ valid: true });
});

// --- Summarize Endpoint ---
app.post("/summarize", authenticateToken, async (req, res) => {
  try {
    const { prompt, text } = req.body;
    if (!text && !prompt) {
      return res
        .status(400)
        .json({ error: "No text or prompt provided for summarization." });
    }

    // --- Add current user prompt/text to history ---
    conversationHistory.push({ role: "User", prompt: prompt || "No prompt", text: text || "" });
    if (conversationHistory.length > 8) conversationHistory.shift(); // keep recent 8 exchanges

    // --- Build conversation context including model replies ---
    const historyContext = conversationHistory
      .map((entry, i) =>
        entry.role === "Model"
          ? `Model Response #${i + 1}: ${entry.text.slice(0, 300)}...`
          : `User #${i + 1} Prompt: ${entry.prompt}\nText: ${
              entry.text ? entry.text.slice(0, 300) + "..." : "No text"
            }`
      )
      .join("\n\n");

    // --- Construct final prompt for Gemini ---
    const finalPrompt = `
You are an academic summarizer specializing in summarizing research papers.
Use the previous conversation messages for better context.

Your job: 
- Identify and organize the content topic-wise.
- Use clear Markdown headings and bullet points.
- Keep it concise but detailed.
- Start with generic phrases like "Okay, here's a summary".
- Output must use this Markdown structure (with clear line breaks and spacing).
- Use bold titles within bullet points where appropriate.



# 🧠 Research Paper Summary
## Title
**[Extracted or Provided Title]**

---

## Abstract
A concise, 4-6 line summary that captures the essence of the paper — its motivation, problem statement, and main idea in natural language.

---

## Key Concepts & Motivation
Explain the background, challenges, and motivation for the research.

---

## Methodology / Approach
Describe how the authors solved the problem or proposed their model. Focus on techniques, architecture, or workflow.

---

## Experimental Results / Evaluation
Summarize how the model was evaluated, what benchmarks were used, and highlight key results.

---

## Key Contributions
List the core findings, innovations, or contributions of the paper.

---

## Limitations / Future Scope
(Optional) Discuss any challenges or possible future improvements.

---

If any section is not applicable, skip it gracefully without leaving blank headers.
Ensure good spacing and readability.
--- Conversation History ---
${historyContext}

--- Current Request ---
Summarize the following content and mention key details:

Prompt: ${prompt || "No user prompt."}
Text: ${text || "No text found."}
--- END ---

If no research content is found, check conversation history for context and respond normally to the user prompt.
`;

    // --- Send to Gemini ---
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: finalPrompt,
    });
    console.log(historyContext)
    const summary =
      response.text ||
      "⚠️ No summary could be generated by the Gemini model.";

    // --- Save model response in history ---
    conversationHistory.push({ role: "Model", text: summary });
    if (conversationHistory.length > 8) conversationHistory.shift();

    res.json({ summary });
  } catch (err) {
    console.error("Gemini API error:", err);
    res
      .status(500)
      .json({ error: "Failed to summarize. Check Gemini API key or content." });
  }
});

// --- Root Route ---
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

