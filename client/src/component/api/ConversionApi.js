import axios from 'axios';

// Function to send input to Rasa and get a response
async function getRasaResponse(input) {
    try {
        // Replace 'http://localhost:5005' with your Rasa server URL
        const rasaURL = 'http://localhost:5005/webhooks/rest/webhook';

        const response = await axios.post(rasaURL, {
            message: input
        });

        // Assuming the response contains an array of messages
        const rasaMessages = response.data;

        // Extracting text from the response messages
        const rasaResponse = rasaMessages.map(message => message.text).join('\n');
        console.log("RasaResoponse", rasaResponse)
        return rasaResponse;
    } catch (error) {
        console.error('Error fetching Rasa response:', error);
        return 'Sorry, I encountered an error while fetching the response.';
    }
}

export { getRasaResponse }