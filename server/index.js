const express = require('express');
const cors = require('cors');
const scanRoutes = require('./routes/scan');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));

app.use('/api', scanRoutes);

app.get('/', (req, res) => {
    res.send({ status: 'API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
