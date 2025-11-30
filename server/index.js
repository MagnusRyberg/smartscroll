const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8008;

app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// Fetch random Wikipedia articles
app.get('/api/random-articles', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 5;
    const articles = [];

    for (let i = 0; i < count; i++) {
      // Get a random article
      const randomResponse = await axios.get('https://en.wikipedia.org/api/rest_v1/page/random/summary', {
        headers: {
          'User-Agent': 'SmartScroll/1.0 (Educational Project)',
          'Api-User-Agent': 'SmartScroll/1.0 (Educational Project)'
        }
      });
      
      const article = {
        title: randomResponse.data.title,
        extract: randomResponse.data.extract,
        thumbnail: randomResponse.data.thumbnail?.source || null,
        pageId: randomResponse.data.pageid,
        url: randomResponse.data.content_urls?.desktop?.page || ''
      };
      
      articles.push(article);
    }

    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error.message);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Fetch full article content
app.get('/api/article/:title', async (req, res) => {
  try {
    const title = decodeURIComponent(req.params.title);
    
    // Get full article content in HTML format
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/mobile-html/${encodeURIComponent(title)}`,
      {
        headers: {
          'User-Agent': 'SmartScroll/1.0 (Educational Project)',
          'Api-User-Agent': 'SmartScroll/1.0 (Educational Project)'
        }
      }
    );
    
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching full article:', error.message);
    res.status(500).json({ error: 'Failed to fetch full article' });
  }
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
