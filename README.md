🧠 Tech Stack
Frontend
React.js
CSS
PDF.js (for extracting text from PDFs)
Backend
Node.js
Express.js
MongoDB (with Mongoose)
Security
JWT (JSON Web Tokens)
bcrypt (password hashing)
AI Integration
Google Gemini API (@google/genai)
DevOps / Deployment
Docker
Docker Compose
CI workflow (GitHub Actions)
🔧 Installation & Setup
📌 Prerequisites

Make sure you have:

Node.js
MongoDB
Docker (optional but recommended)
🛠️ 1. Clone the Repository
git clone https://github.com/your-username/research-paper-summarizer.git
cd research-paper-summarizer
🛠️ 2. Setup Backend
cd backend
npm install

Create a .env file:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key

Run backend:

node server.js
🛠️ 3. Setup Frontend
cd frontend
npm install
npm start
🐳 Run Using Docker (Recommended)
docker-compose up --build
🔐 Authentication Flow
User registers → data stored in MongoDB
Password is hashed using bcrypt
Login returns JWT token
Token is used to access protected routes
📌 API Endpoints (Important)
Auth Routes
POST /login → Login user
POST /register → Register user
Protected Routes
Require JWT token
🎯 Special Highlights (What Makes This Project Strong)
🔥 Real-world full stack project
🤖 AI integration (Gemini API)
📄 PDF parsing + summarization
🔐 Secure authentication system
💬 Chat-based UX (modern UI pattern)
🐳 Dockerized deployment
🚀 Future Improvements
Add multiple summarization modes (short / detailed)
Highlight key points automatically
Add file history (saved summaries)
Support for DOCX / TXT files
Improve UI/UX with animations
👨‍💻 Author

Lakshit Tyagi

📜 License

This project is open-source and available under the MIT License.







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

