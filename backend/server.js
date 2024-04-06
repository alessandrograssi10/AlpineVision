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

app.get('/', (req, res) => {
  res.send('Hello World from Backend!');
});

// Nuovo endpoint per ottenere la lista di nomi
app.get('/products', (req, res) => {
  res.json(products); // Invia la lista di nomi come JSON
});


app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
