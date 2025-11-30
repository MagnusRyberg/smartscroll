SmartScroll — Static single-page app

This is a tiny static version of SmartScroll that needs no server. Open `index.html` in your browser to run the app.

Features
- Fetches random article summaries from Wikipedia using the public REST API.
- Infinite-scroll (auto-load) and a 'Load more' button as a fallback.
- Dark, card-style UI; opens full article on Wikipedia in a new tab.
 - Instagram-like grid of cards; click a card to open a modal with larger image, full extract and link.

Notes
- Because it uses the public Wikipedia REST API from the browser, some browsers or networks may block cross-origin requests; if that happens you can use the API-based server version in the main repo.

How to run
1. Double-click `index.html` or open it from your browser's File > Open.
2. Scroll to load more articles or click "Load more".
