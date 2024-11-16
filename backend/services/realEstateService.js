const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const axios = require('axios');


async function extractFeaturesFromText(text) {
    try {
        const response = await axios.post(`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`, {
            messages: [
                { role: "system", content: "You are an assistant that extracts features from real estate descriptions." },
                { role: "user", content: `Extract the following features from the text: "title", "displayAddress", "bathrooms", "bedrooms", "addedOn", "type", "price", "sizeMin", "furnishing". If a feature is not present in the text, return it as null.\n\nText: "${text}"\n\nFeatures (comma-separated):` }
            ],
            max_tokens: 150,
            temperature: 0.7
        }, {
            headers: {
                'api-key': process.env.AZURE_OPENAI_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        // Extract content from the message object
        if (!response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
            throw new Error('Invalid response format from API');
        }

        const rawText = response.data.choices[0].message.content;

        // Handle response parsing errors or unexpected formats
        const featuresArray = rawText.trim().split(',').map(item => {
            const parts = item.split(': ');
            return parts.length > 1 ? parts[1].trim().replace(/['"]+/g, '') : 'null'; // Remove quotes and handle missing values
        });

        // Map extracted values to feature keys
        const features = {
            title: featuresArray[0] || 'null',
            displayAddress: featuresArray[1] || 'null',
            bathrooms: featuresArray[2] || 'null',
            bedrooms: featuresArray[3] || 'null',
            addedOn: featuresArray[4] || 'null',
            type: featuresArray[5] || 'null',
            price: featuresArray[6] || 'null',
            sizeMin: featuresArray[7] || 'null',
            furnishing: featuresArray[8] || 'null'
        };

        console.log('Extracted features:', features);
        return features;
    } catch (error) {
        console.error('Error extracting features:', error.response ? error.response.data : error.message);
        throw new Error('Failed to extract features');
    }
}

function cleanProperties(features) {
    const cleanedFeatures = { ...features }; // Make a copy of features to preserve immutability
    
    // Ensure numbers are parsed correctly and handle null values
    cleanedFeatures.bedrooms = cleanedFeatures.bedrooms !== 'null' && cleanedFeatures.bedrooms !== null ? parseInt(cleanedFeatures.bedrooms, 10) : null;
    cleanedFeatures.bathrooms = cleanedFeatures.bathrooms !== 'null' && cleanedFeatures.bathrooms !== null ? parseInt(cleanedFeatures.bathrooms, 10) : null;
    cleanedFeatures.price = cleanedFeatures.price !== 'null' && cleanedFeatures.price !== null ? parseFloat(cleanedFeatures.price) : null;

    return cleanedFeatures;
}

const searchPropertiesInCSV = (cleanedProperties, csvFilePath) => {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => {
                // Clean and normalize data
                const row = {
                    displayAddress: data.displayAddress ? data.displayAddress.trim().toLowerCase() : null,
                    bedrooms: data.bedrooms ? parseInt(data.bedrooms, 10) : null,
                    bathrooms: data.bathrooms ? parseInt(data.bathrooms, 10) : null,
                    price: data.price ? parseFloat(data.price) : null,
                    type: data.type ? data.type.trim().toLowerCase() : null
                };

                const matches = cleanedProperties.filter(property => {
                    let isMatch = true;

                    if (row.bedrooms !== property.bedrooms) {
                        isMatch = false;
                    }

                    if (property.price && row.price && row.price > property.price) {
                        isMatch = false;
                    }

                    if (property.displayAddress && row.displayAddress && !row.displayAddress.includes(property.displayAddress.toLowerCase())) {
                        isMatch = false;
                    }

                    return isMatch;
                });

                if (matches.length > 0) {
                    results.push(data); // Push original data row
                }
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

exports.searchProperties = async (message) => {
    console.log('Searching properties with message:', message);
    const features = await extractFeaturesFromText(message);
    const cleanedProperties = cleanProperties(features);

    const csvFilePath = './data/uae_real_estate_2024.csv';
    const csvResults = await searchPropertiesInCSV([cleanedProperties], csvFilePath);
    console.log(csvResults.length);
    return csvResults;
};
