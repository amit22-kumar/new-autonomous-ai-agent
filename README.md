Autonomous Research Agent

An AI-powered agent that understands research goals, breaks them into steps, and executes tasks autonomously to generate comprehensive reports.

✨ Features

Natural language goal understanding

Automatic task planning & execution

Integrated research tools (search, fetch, analyze)

Real-time progress updates

Final report generation

🛠 Tech Stack

Backend: Python, FastAPI

Frontend: React

AI: LLM-based planning & execution

⚙️ Setup
Backend
cd backend
pip install -r requirements.txt
cp .env.example .env   # add ANTHROPIC_API_KEY
python -m api.main


Backend runs at: http://localhost:8000

Frontend
cd frontend
npm install
npm start


Frontend runs at: http://localhost:3000

🚀 Usage

Enter a research goal

Click Start Agent

Track real-time execution

View the final synthesized report