const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Questo abilita CORS per tutte le routes
app.use('/images', express.static('public/images'));

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
      id: 'SkiResorts',
      title: 'The Best Ski Resorts in the Alps',
      image: 'http://localhost:3020/images/img1.webp',
      description: 'Discover the top ski resorts in the Alps and plan your next winter adventure.',
      Art_p1: "Le Alpi, con i loro picchi imponenti che attraversano l'Europa, offrono alcune delle esperienze sciistiche più esilaranti e panoramiche del mondo. Dai resort di lusso alle località adatte alle famiglie, ci sono destinazioni per ogni tipo di appassionato di sport invernali. In questo articolo, esploreremo alcuni dei migliori resort sciistici delle Alpi, perfetti per chi cerca avventure sulla neve senza pari.",
      Art_p2_title: "Zermatt, Svizzera",
      Art_p2: "Situato ai piedi del Monte Bianco, il più alto picco delle Alpi, Chamonix è un paradiso per gli sciatori esperti e gli appassionati di sport estremi. Con la sua famosa Vallée Blanche, una delle più lunghe discese sciistiche al mondo, e una varietà di terreni impegnativi, Chamonix attrae sciatori e snowboarder da tutto il globo. Oltre allo sci, la località offre straordinarie opportunità per l'alpinismo, il parapendio e le escursioni su ghiacciaio.Situato ai piedi del Monte Bianco, il più alto picco delle Alpi, Chamonix è un paradiso per gli sciatori esperti e gli appassionati di sport estremi. Con la sua famosa Vallée Blanche, una delle più lunghe discese sciistiche al mondo, e una varietà di terreni impegnativi, Chamonix attrae sciatori e snowboarder da tutto il globo. Oltre allo sci, la località offre straordinarie opportunità per l'alpinismo, il parapendio e le escursioni su ghiacciaio.Situato ai piedi del Monte Bianco, il più alto picco delle Alpi, Chamonix è un paradiso per gli sciatori esperti e gli appassionati di sport estremi. Con la sua famosa Vallée Blanche, una delle più lunghe discese sciistiche al mondo, e una varietà di terreni impegnativi, Chamonix attrae sciatori e snowboarder da",
      Art_p3_title: "Zermatt, Svizzera",
      Art_p3: "Situato ai piedi del Monte Bianco, il più alto picco delle Alpi, Chamonix è un paradiso per gli sciatori esperti e gli appassionati di sport estremi. Con la sua famosa Vallée Blanche, una delle più lunghe discese sciistiche al mondo, e una varietà di terreni impegnativi, Chamonix attrae sciatori e snowboarder da tutto il globo. Oltre allo sci, la località offre straordinarie opportunità per l'alpinismo, il parapendio e le escursioni su ghiacciaio.Situato ai piedi del Monte Bianco, il più alto picco delle Alpi, Chamonix è un paradiso per gli sciatori esperti e gli appassionati di sport estremi. Con la sua famosa Vallée Blanche, una delle più lunghe discese sciistiche al mondo, e una varietà di terreni impegnativi, Chamonix attrae sciatori e snowboarder da tutto il globo. Oltre allo sci, la località offre straordinarie opportunità per l'alpinismo, il parapendio e le escursioni su ghiacciaio.Situato ai piedi del Monte Bianco, il più alto picco delle Alpi, Chamonix è un paradiso per gli sciatori esperti e gli appassionati di sport estremi. Con la sua famosa Vallée Blanche, una delle più lunghe discese sciistiche al mondo, e una varietà di terreni impegnativi, Chamonix attrae sciatori e snowboarder da",
      author: 'John Doe',
      date: 'January 15, 2024',
      //
      //
  },
  {
    id: 'SK',
      title: 'Tips for Beginners: Learning to Ski',
      image: 'http://localhost:3020/images/img1.webp',
      description: 'If you are new to skiing, check out these helpful tips to get started on the slopes.',
      author: 'Jane Smith',
      date: 'February 5, 2024',
  },
  {
    id: 'SKd',

      title: 'Tips for Beginners: Learning to Ski',
      image: 'http://localhost:3020/images/img1.webp',
      description: 'If you are new to skiing, check out these helpful tips to get started on the slopes.',
      author: 'Jane Smith',
      date: 'February 5, 2024',
  },
  {
    id: 'SKbn',
      title: 'Tips for Beginners: Learning to Ski',
      image: 'http://localhost:3020/images/img1.webp',
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
