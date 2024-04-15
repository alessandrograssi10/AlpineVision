const express = require('express');
const { connectToDatabase } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const productRoutes=require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectToDatabase().then(() => {
    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);

    app.listen(PORT, () => {
        console.log(`Server in ascolto sulla porta ${PORT}`);
    });
});
