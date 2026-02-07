# Hermes AI - Misinformation Detection Platform

![Hermes Logo](./frontend/public/favicon.png)

**AI-powered fact-checking and misinformation detection platform built with Gemini 3 Flash**

## 🎯 Features

- ✅ **Content Filtering** - AI validates content before fact-checking (rejects spam, attacks, etc.)
- ✅ **Category-Based Grouping** - 9 color-coded categories (Politics, Health, Science, etc.)
- ✅ **Three-Tab Navigation** - Fact Check | Feed | Trending (mobile responsive)
- ✅ **Social Browse Mode** - Browse feed and upvote without mandatory submission
- ✅ **Enhanced Timestamps** - Relative time display ("5m ago", "3h ago")
- ✅ **Duplicate Detection** - AI semantic similarity clustering
- ✅ **CSV Export** - Download top 5 trending + last 25 recent detections

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/hermes-ai.git
cd hermes-ai

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Configure backend environment
cd ../backend
cp .env.example .env
# Edit .env and add your:
# - MONGO_URI
# - GEMINI_API_KEY

# 4. Run backend (Terminal 1)
npm run dev

# 5. Run frontend (Terminal 2)
cd ../frontend
npm run dev

# 6. Open browser
# http://localhost:5173
```

## 📦 Project Structure

```
hermes/
├── backend/
│   ├── index.js              # Express server
│   ├── routes/
│   │   ├── verify.js         # Fact-check endpoint
│   │   ├── dashboard.js      # Feed data
│   │   ├── trending.js       # Trending endpoint
│   │   └── export.js         # CSV export
│   ├── services/
│   │   ├── aiService.js      # Gemini AI integration
│   │   └── similarityService.js  # Duplicate detection
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main app + navigation
│   │   ├── components/
│   │   │   ├── Landing.jsx   # Homepage
│   │   │   ├── VerificationForm.jsx
│   │   │   ├── Feed.jsx      # Feed with categories
│   │   │   ├── Trending.jsx  # Trending view
│   │   │   └── MessageCluster.jsx
│   │   └── styles/
│   │       └── index.css     # Global styles
│   └── package.json
│
└── README.md
```

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete step-by-step instructions to deploy on Render.com.

### Quick Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

1. Fork this repository
2. Create MongoDB Atlas database
3. Connect to Render
4. Add environment variables
5. Deploy!

**Required Environment Variables:**
```env
PORT=4000
NODE_ENV=production
MONGO_URI=mongodb+srv://...
MONGO_DB_NAME=hermes_ai
GEMINI_API_KEY=AIza...
CORS_ORIGIN=https://your-app.onrender.com
```

## 🧪 Testing

### Test Fact-Checking
1. Go to "Fact Check" tab
2. Submit: "The Earth is flat"
3. AI analyzes and returns verdict

### Test Content Filtering
1. Submit: "You idiot!" → Rejected as personal attack
2. Submit: "Buy my product!" → Rejected as spam
3. Submit news → Analyzes successfully

### Test Categories
1. Go to "Feed" tab
2. Click category buttons (Politics, Health, Science)
3. Feed filters to show only that category

### Test Export
1. Click "Export CSV" button
2. Downloads CSV with top 5 trending + last 25 recent

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Gemini 3 Flash API
- Axios, Helmet, CORS

### Frontend
- React + Vite
- Lucide React (icons)
- CSS Variables (theming)
- Mobile-first responsive design

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/verify` | Fact-check content |
| GET | `/api/dashboard` | Get feed items |
| GET | `/api/trending` | Get trending items |
| POST | `/api/upvote` | Upvote an item |
| GET | `/api/export` | Export CSV report |
| GET | `/health` | Health check |

## 🎨 UI/UX

- Clean, professional design
- Mobile-first responsive
- Color-coded categories
- Real-time relative timestamps
- Smooth animations
- Minimal and modern

## 🔐 Security

- Helmet.js for security headers
- CORS configuration
- Rate limiting on API endpoints
- Environment variable protection
- Content validation before processing

## 📈 Scaling

- Free tier: 512 MB MongoDB, 750 hrs/month
- Upgrade to Starter ($7/mo) for always-on
- MongoDB Atlas auto-scaling available

## 📝 License

MIT License - feel free to use for your own projects!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📧 Contact

Built by Jeeva | [GitHub](https://github.com/YOUR_USERNAME)

---

⭐ Star this repo if you find it helpful!
