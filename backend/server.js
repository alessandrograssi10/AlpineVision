const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./config/database');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const postsRoutes = require('./routes/postRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());  // Attiva CORS per tutte le routes
app.use(express.json());

connectToDatabase().then(() => {
    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/posts', postsRoutes);
    app.use('/api/carts',cartRoutes);

    app.listen(PORT, () => {
        console.log(`Server in ascolto sulla porta ${PORT}`);
    });
});
