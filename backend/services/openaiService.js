const axios = require('axios');

exports.generateResponse = async (message, properties) => {
    console.log('Generating response for chatbot...');
    const apiKey = process.env.AZURE_OPENAI_API_KEY;

    const formattedProperties = JSON.stringify(properties, null, 2);
    const userMessage = `User is looking for real estate properties in UAE with the following criteria: ${message}. Here are some properties that match the criteria: ${formattedProperties}. Provide a summary of these properties.`;

    try {
        const response = await axios.post(
            `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`,
            {
                messages: [
                    { role: "system", content: "You are a real estate assistant providing summaries of property listings." },
                    { role: "user", content: userMessage }
                ],
                // max_tokens: 450,
                temperature: 0.7
            },
            {
                headers: {
                    'api-key': apiKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Azure OpenAI API connected successfully.');
        console.log('Response from Azure OpenAI:', response.data);

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error connecting to Azure OpenAI API:', error.response ? error.response.data : error.message);
        throw new Error('Failed to connect to Azure OpenAI API');
    }
};
