const { generateResponse } = require('../services/openaiService');
const { searchProperties } = require('../services/realEstateService');

exports.getChatbotResponse = async (req, res) => {
    const { message } = req.body;
    console.log('Received message:', message);
    
    try {
        console.log('Searching...');
        const properties = await searchProperties(message);

        console.log('Properties found:', properties.length);

        const response = await generateResponse(message, properties);
        console.log('Generated response:', response);

        res.json({ response });
    } catch (error) {
        console.error('Error in getChatbotResponse:', error.message);
        res.status(500).json({ error: 'Failed to get response from chatbot' });
    }
};