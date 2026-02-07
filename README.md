# Hermes - AI-Powered Misinformation Detection

Hermes is an advanced misinformation detection platform powered by Google's Gemini AI. It provides real-time text verification with confidence scores, category classification, and detailed explanations. Built with a clean, professional UI inspired by modern banking applications.

---

## Features

- **AI-Powered Detection**: Utilizes Gemini 2.5 Flash for accurate misinformation analysis
- **Confidence Scoring**: Provides detailed confidence levels for every analysis
- **Category Classification**: Automatically categorizes content (politics, health, science, climate, etc.)
- **Real-time Analysis**: Instant verification with comprehensive explanations
- **Community Engagement**: Upvote system for tracking significant detections
- **Analytics Dashboard**: View trends, category breakdowns, and statistics
- **Clean UI**: Professional banking-style interface with Inter font
- **MongoDB Integration**: Persistent storage for historical analysis
- **Rate Limiting**: Built-in API protection and security
- **Fallback System**: Grok API fallback when Gemini is unavailable

---

## Technology Stack

### Backend
- **Node.js** with Express
- **MongoDB** for data storage
- **Gemini AI** (primary) / Grok API (fallback)
- **Security**: Helmet, CORS, rate limiting

### Frontend
- **React** 18 with Vite
- **Axios** for API calls
- **Lucide React** for icons
- **Custom CSS** (LedgerKnight banking style)

---

## Project Structure

```
Hermes/
├── backend/
│   ├── routes/          # API endpoints
│   │   ├── verify.js    # Text verification
│   │   ├── dashboard.js # Analytics
│   │   └── upvote.js    # Community voting
│   ├── services/
│   │   ├── database.js  # MongoDB connection
│   │   └── aiService.js # AI integration
│   ├── index.js         # Main server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── styles/      # CSS styling
│   │   ├── App.jsx      # Main app
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── render.yaml          # Render deployment config
├── .env.example         # Environment template
├── package.json         # Root scripts
└── README.md
```

---

## Local Development Setup

### 1. Install Dependencies

```bash
cd Hermes
npm run install:all
```

This installs dependencies for both backend and frontend.

### 2. Configure Environment Variables

Create `backend/.env` file:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
MONGO_DB_NAME=hermes_ai
GEMINI_API_KEY=your_gemini_api_key
GROK_API_KEY=your_grok_api_key_optional
CORS_ORIGIN=http://localhost:5173
```

### 3. Start Backend

```bash
# In one terminal
npm run dev:backend
```

Backend will run on http://localhost:4000

### 4. Start Frontend

```bash
# In another terminal
npm run dev:frontend
```

Frontend will run on http://localhost:5173

### 5. Access the Application

Open http://localhost:5173 in your browser.

---

## API Endpoints

### POST /api/verify
Verify text for misinformation

**Request:**
```json
{
  "text": "Content to verify"
}
```

**Response:**
```json
{
  "verdict": "misinformation" | "reliable",
  "is_misinformation": boolean,
  "confidence": 0.0-1.0,
  "category": "politics" | "health" | "science" | ...,
  "explanation": "Detailed explanation",
  "analyzed_at": "ISO timestamp"
}
```

### GET /api/dashboard
Get analytics and statistics

**Response:**
```json
{
  "summary": [{
    "category": "politics",
    "count": 10,
    "avgConfidence": 0.85,
    "totalUpvotes": 15,
    "items": [...]
  }],
  "stats": {
    "total": 50,
    "totalUpvotes": 100,
    "avgConfidence": 0.78
  }
}
```

### POST /api/upvote
Upvote a misinformation detection

**Request:**
```json
{
  "category": "politics",
  "text": "Content that was detected"
}
```

### GET /health
Health check endpoint

---

## Deployment to Render

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`

### 3. Add Environment Variables

In Render dashboard, add:
- `MONGO_URI`: Your MongoDB connection string
- `GEMINI_API_KEY`: Your Gemini API key
- `GROK_API_KEY`: (Optional) Grok API key
- `CORS_ORIGIN`: Your Render app URL (e.g., https://hermes.onrender.com)

### 4. Deploy

Click "Create Web Service" and Render will automatically build and deploy.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 4000) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `MONGO_DB_NAME` | No | Database name (default: hermes_ai) |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `GROK_API_KEY` | No | Grok API key (fallback) |
| `CORS_ORIGIN` | Yes | Frontend URL for CORS |

---

## Features Implementation

### AI Analysis
- Primary: Gemini 2.0 Flash Exp
- Fallback: Grok API (if configured)
- Error handling with safe defaults

### Security
- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 req/min global, 20 req/min for verification)
- Input validation
- MongoDB connection with graceful error handling

### UI/UX
- Exact LedgerKnight banking style
- Inter font family
- Responsive design
- Loading states
- Error handling
- Message banners
- Progress indicators

---

## License

MIT License

---

## Acknowledgements

- UI design inspired by LedgerKnight
- Powered by Google Gemini AI
- Built with React and Node.js

---

**Maintainer:** [jeevapriyan10](https://github.com/jeevapriyan10)
