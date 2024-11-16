import React, { useState } from 'react';
import axios from 'axios';

function Chatbot() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSend = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await axios.post('http://localhost:5000/api/chatbot/message', { message: query });
            console.log('Response from chatbot:', result.data.response);
            setResponse(result.data.response);
            setQuery(''); // Optionally clear the input field
        } catch (error) {
            console.error('Error fetching chatbot response:', error);
            setError('Error connecting to the chatbot. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>Real Estate Chatbot</h1>
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your query here..."
                style={{ width: '100%', height: '100px', marginBottom: '10px' }}
                disabled={loading}
            ></textarea>
            <button onClick={handleSend} style={{ padding: '10px 20px' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
            </button>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '10px' }}>
                <h3>Response:</h3>
                <p>{response}</p>
            </div>
        </div>
    );
}

export default Chatbot;