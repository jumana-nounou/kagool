# Real Estate Chatbot

This project is a real estate chatbot integrated with Azure OpenAI. The chatbot helps users find real estate properties based on their criteria.

## Getting Started

### Prerequisites

- Node.js
- npm
- Express (for the backend)
- React (for the frontend)

### Installation

1. Clone the repository:

    ```sh
    git clone <repository-url>
    ```

2. Navigate to the `frontend` and `backend` directories and install the dependencies:

    ```sh
    cd frontend
    npm install
    ```

    ```sh
    cd backend
    npm install
    ```

### Running the Application

To run the application, you need to start both the frontend and backend servers simultaneously in different terminals.

1. Start the backend server:

    ```sh
    cd backend
    node app.js
    ```

2. Start the frontend server:

    ```sh
    cd frontend
    npm start
    ```

### Usage

Once both servers are running, you can access the chatbot application in your browser at `http://localhost:3000`.

### Functionality
- **User Input**: Users can input their real estate requirements through the chatbot interface.
- **Azure OpenAI Integration**: The backend uses Azure OpenAI to process the user's input and extract relevant features.
- **Property Search**: The extracted features are used to search for matching properties in a CSV file containing real estate data.
- **Response Generation**: The backend generates a response summarizing the matching properties and sends it back to the frontend.
- **Chat Interface**: The frontend displays the user's input and the chatbot's responses in a chat interface.
