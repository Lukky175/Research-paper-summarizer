📄 Research Paper Summarizer
🚀 Overview

The Research Paper Summarizer is a full-stack web application that helps users quickly understand long research papers by generating concise summaries using AI.

Instead of reading an entire PDF (which can take hours), users can simply upload a paper or paste text, and the app will extract the content and generate a simplified summary in seconds.

This project is designed to be useful for:

Students 📚
Researchers 🧪
Developers 👨‍💻
Anyone who wants quick insights from long documents
✨ Key Features
🔐 User Authentication
Secure login & registration system
Passwords are encrypted using hashing
JWT-based authentication for protected routes
📄 PDF Upload & Text Extraction
Upload research papers in PDF format
Automatically extracts text from all pages
Uses PDF.js for accurate extraction
🤖 AI-Powered Summarization
Uses Google Gemini API for generating summaries
Converts long, complex text into easy-to-understand summaries
Supports conversational interaction (chat-style UI)
💬 Chat-Based Interface
Users interact with the system like a chatbot
Can ask questions or request summaries
Maintains conversation flow
🌐 Full Stack Architecture
Frontend: React.js
Backend: Node.js + Express
Database: MongoDB
AI Integration: Gemini API
🐳 Docker Support
Dockerized setup for easy deployment
Includes docker-compose for multi-service setup
🏗️ Project Structure
Research-paper-summarizer-main/
│
├── backend/
│   ├── server.js          # Main backend server
│   ├── package.json
│   ├── Dockerfile
│   └── logins.json
│
├── frontend/
│   ├── src/
│   │   ├── landingpage/   # Main summarizer UI
│   │   ├── pages/         # Login & Register pages
│   │   ├── NavigationBar/
│   │   └── RouteProtection/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── package.json
└── README.md
⚙️ How It Works (Simple Explanation)
User logs into the app
Uploads a research paper (PDF) OR enters text
The system:
Extracts text from the PDF
Sends it to the AI model
AI processes the content and generates a summary
The summary is displayed in a chat-like interface

👉 In short:
PDF → Text → AI → Summary





This Version: -> 
    Updated server.js to support new gemini sdk (response).
    
Next Version:-
remove logins.json (

we have to delete this file and create a new one with the same name, but with the following content:
maps database logins to the users of the system, so that we can authenticate them when they try to log in. The file should be a JSON file with the following structure:
not good, we should use a more secure way to store the logins, such as a database or an encrypted file. 
)

Terraform files
Jenkins CI/CD Pipeline
K8

