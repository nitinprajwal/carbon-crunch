# Carbon Crunch - Code Analysis Tool

A modern web application for analyzing code quality and providing detailed insights for Python, JavaScript, and React files.

## Features

- 📊 Real-time code analysis
- 📈 Visual analytics with interactive graphs
- 🎨 Clean, modern UI
- 💻 Support for multiple languages:
  - Python (.py)
  - JavaScript (.js)
  - React (.jsx)
- 📝 Detailed code quality metrics
- 🔍 Issue detection and recommendations

## Project Structure

```
Carbon Crunch/
├── frontend/                # React frontend
│   ├── public/             # Static files
│   │   ├── components/    # React components
│   │   ├── types/        # TypeScript types
│   │   └── styles/       # CSS styles
│   ├── package.json      # Frontend dependencies
│   └── vite.config.ts    # Vite configuration
└── backend/              # Python FastAPI backend
    ├── main.py          # Main application file
    └── requirements.txt # Python dependencies
```

## Prerequisites

- Node.js 18+ for frontend
- Python 3.12+ for backend
- npm or yarn package manager

## Frontend Setup

1. Navigate to the frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
# or
yarn install
```

3. Start the development server:
```powershell
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:5173`

## Backend Setup

1. Navigate to the backend directory:
```powershell
cd backend
```

2. Create and activate a virtual environment:
```powershell
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Linux/Mac
```

3. Install dependencies:
```powershell
pip install -r requirements.txt
```

4. Start the development server:
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /`: Health check endpoint
- `POST /analyze-code`: Upload and analyze code files
  - Accepts: `.py`, `.js`, `.jsx` files
  - Returns: Analysis results including:
    - Code quality metrics
    - Issue detection
    - Recommendations
    - Severity breakdown

## Testing

### Backend API Testing
You can test the API using the FastAPI automatic documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Frontend Testing
Run the test suite:
```powershell
npm test
# or
yarn test
```

## Building for Production

### Frontend Build
```powershell
cd frontend
npm run build
# or
yarn build
```

### Backend Production Deployment
```powershell
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Developer

Developed by Nitin Prajwal R © 2025

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/nitinprajwal/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black)](https://github.com/nitinprajwal) 