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

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
cd ..
```

Or use the combined command:
```bash
npm run install-all
```

## Running the Application

### Development Mode

Run both the backend server and React frontend:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- React frontend on `http://localhost:3000`

### Run Individually

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## Usage

1. Open `http://localhost:3000` in your browser (preferably in mobile view)
2. Scroll through random Wikipedia articles
3. Click "Read more" on any article to expand the full text
4. Click the Wikipedia link to view the complete article on Wikipedia
5. Keep scrolling - new articles load automatically!

## Project Structure

```
smartscroll/
├── server/
│   └── index.js          # Express backend API
├── client/
│   ├── public/
│   │   └── index.html    # HTML template
│   ├── src/
│   │   ├── App.js        # Main app component
│   │   ├── App.css       # App styles
│   │   ├── ArticleCard.js    # Article card component
│   │   ├── ArticleCard.css   # Card styles
│   │   ├── index.js      # React entry point
│   │   └── index.css     # Global styles
│   └── package.json      # Client dependencies
├── package.json          # Root dependencies
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
