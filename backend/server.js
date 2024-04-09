const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Questo abilita CORS per tutte le routes

const port = 3020;

// Lista di nomi
const products = [
  'Alessandro',
  'Beatrice',
  'Carlo',
  'Diana',
  'Emanuele'
];
const blogPosts = [
  {
      id: 'SKirep',
      title: 'The Best Ski Resorts in the Alps',
      image: 'https://example.com/ski-resorts.jpg',
      description: 'Discover the top ski resorts in the Alps and plan your next winter adventure.',
      author: 'John Doe',
      date: 'January 15, 2024',
      //
      //
  },
  {
    id: 'SK',
      title: 'Tips for Beginners: Learning to Ski',
      image: 'https://example.com/learning-to-ski.jpg',
      description: 'If you are new to skiing, check out these helpful tips to get started on the slopes.',
      author: 'Jane Smith',
      date: 'February 5, 2024',
  },
  {
    id: 'SKd',

      title: 'Tips for Beginners: Learning to Ski',
      image: 'https://example.com/learning-to-ski.jpg',
      description: 'If you are new to skiing, check out these helpful tips to get started on the slopes.',
      author: 'Jane Smith',
      date: 'February 5, 2024',
  },
  {
    id: 'SKbn',
      title: 'Tips for Beginners: Learning to Ski',
      image: 'https://example.com/learning-to-ski.jpg',
      description: 'If you are new to skiing, check out these helpful tips to get started on the slopes.',
      author: 'Jane Smith',
      date: 'February 5, 2024',
  },
  // Puoi aggiungere altri blog posts qui
];

app.get('/', (req, res) => {
  res.send('Hello World from Backend!');
});

// Nuovo endpoint per ottenere la lista di nomi
app.get('/products', (req, res) => {
  res.json(products); // Invia la lista di nomi come JSON
});

app.get('/blog-posts', (req, res) => {
  res.json(blogPosts); // Invia l'array di blogPosts come JSON
});
app.get('/blog-posts/:id', (req, res) => {
  const { id } = req.params;
  const post = blogPosts.find(post => post.id === id);

  if (post) {
    res.json(post);
  } else {
    res.status(404).send('Post non trovato');
  }
});
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
