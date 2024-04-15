const express = require('express');
const { connectToDatabase } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const productRoutes=require('./routes/productRoutes');
const postsRoutes=require('./routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectToDatabase().then(() => {
    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/posts',postsRoutes);


    app.listen(PORT, () => {
        console.log(`Server in ascolto sulla porta ${PORT}`);
    });
});
