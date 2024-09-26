const express = require('express');
const cors = require('cors');
const fetch = require('cross-fetch');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

// Swiggy CDN URL (no server required for static images)
app.get('/cdn/:image', (req, res) => {
  const { image } = req.params;
  const imageUrl = `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/${image}`;
  res.redirect(imageUrl);
});

// Proxy for Menu API
app.get('/api/menu', (req, res) => {
  const { restaurantId } = req.query;
  const url = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=17.7635223&lng=83.3081172&restaurantId=${restaurantId}`;

  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest',  // Mark as AJAX request
    }
  })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Failed to fetch menu");
      }
    })
    .then(data => res.json(data))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch menu' });
    });
});

// Proxy for Swiggy Restaurant List API
app.get('/api/restaurants', (req, res) => {
  const { lat, lng } = req.query;
  const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;

  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
  })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch restaurants' });
    });
});

// Proxy for Address Recommendation API
app.get('/api/address', (req, res) => {
  const { lat, lng } = req.query;
  const url = `https://www.swiggy.com/dapi/misc/address-recommend?latlng=${lat}%2c${lng}`;

  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
  })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch address' });
    });
});

// Proxy for Place Autocomplete API
app.get('/api/place-autocomplete', (req, res) => {
  const { input } = req.query;
  const url = `https://www.swiggy.com/dapi/misc/place-autocomplete?input=${encodeURIComponent(input)}`;

  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
  })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Failed to fetch place autocomplete");
      }
    })
    .then(data => res.json(data))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch place autocomplete' });
    });
});

// Proxy for Address Details by Place ID API
app.get('/api/address-by-place', (req, res) => {
  const { place_id } = req.query;
  const url = `https://www.swiggy.com/dapi/misc/address-recommend?place_id=${place_id}`;

  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
  })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch address by place ID' });
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
