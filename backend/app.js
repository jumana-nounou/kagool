const express = require('express');
const dotenv = require('dotenv');
const chatbotRoutes = require('./routes/chatbot.js');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/chatbot', chatbotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));