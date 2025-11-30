# SmartScroll - Wikipedia Article Feed

A mobile-first web application that displays random Wikipedia articles in an infinite scrolling feed, similar to Instagram or Twitter/X.

## Features

- 📱 Mobile-optimized responsive design
- 🔄 Infinite scroll with automatic loading
- 📰 Random Wikipedia articles with images
- ✂️ Text truncation at 200 characters with expand/collapse
- 🎨 Dark theme optimized for mobile viewing
- 🔗 Links to full Wikipedia articles

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Install all dependencies:
```bash
npm run install-all
```

## Running the Application

### Development Mode

Run the combined server (builds React app and serves everything):

```bash
npm run dev
```

This will:
- Build the React frontend
- Start the Express server on port 8008
- Serve both API and static files from one server

### Production Mode

For production deployment:

```bash
npm start
```

### Individual Commands

**Build the React app:**
```bash
npm run build
```

**Start only the server:**
```bash
npm run server
```

## Usage

1. Open `http://localhost:8008` in your browser (preferably in mobile view)
2. Scroll through random Wikipedia articles
3. Click "Read more" on any article to expand the full text
4. Click the Wikipedia link to view the complete article on Wikipedia
5. Keep scrolling - new articles load automatically!

## Deployment

### Azure Static Web Apps (Recommended)

This app is optimized for deployment to Azure Static Web Apps:

1. **Create Azure Static Web App** in Azure Portal
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - Build command: `npm run build`
   - Output location: `client/build`
   - API location: `server` (optional for advanced setups)

### Azure App Service

For full server control:

1. **Create Web App** in Azure Portal
2. **Set runtime stack** to Node.js
3. **Configure deployment** from GitHub
4. **Set startup command:** `npm start`

### Vercel (Alternative)

If you prefer Vercel:

1. **Connect GitHub repository** to Vercel
2. **Use default settings** - the app is already configured

See `AZURE_DEPLOYMENT.md` for detailed deployment instructions.

## Project Structure

```
smartscroll/
├── server/
│   └── index.js          # Express backend API + static file serving
├── client/
│   ├── public/
│   │   └── index.html    # HTML template
│   ├── src/
│   │   ├── App.js        # Main app component
│   │   ├── App.css       # App styles
│   │   ├── ArticleCard.js    # Article card component
│   │   ├── ArticleCard.css   # Card styles
│   │   ├── ArticleModal.js   # Modal component
│   │   ├── ArticleModal.css  # Modal styles
│   │   ├── index.js      # React entry point
│   │   └── index.css     # Global styles
│   └── build/            # Built React app (generated)
│       ├── index.html
│       ├── static/
│       └── ...
├── package.json          # Root dependencies and scripts
└── README.md            # This file
```

## API

### GET /api/random-articles

Fetches random Wikipedia articles.

**Query Parameters:**
- `count` (optional): Number of articles to fetch (default: 5)

**Response:**
```json
[
  {
    "title": "Article Title",
    "extract": "Article summary text...",
    "thumbnail": "https://image-url.jpg",
    "pageId": 12345,
    "url": "https://en.wikipedia.org/wiki/Article_Title"
  }
]
```

## Technologies Used

- **Backend:** Node.js, Express, Axios
- **Frontend:** React, CSS3
- **API:** Wikipedia REST API v1

## Mobile Testing

For best experience, open in Chrome DevTools mobile view or on an actual mobile device.

Recommended viewport: 375x812 (iPhone X/11/12 size)

## License

ISC
