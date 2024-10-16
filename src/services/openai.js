import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const MAX_RETRIES = 2;
const INITIAL_BACKOFF = 3000; // 3 sekunde


const openaiService = {
  generateResponse: async (message, retryCount = 0) => {
    try {
      const response = await axios.post(API_URL, {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 150
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('API Response Headers:', response.headers);
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Podrobnosti napake:', error.response ? error.response.data : error);
      console.error('Glava odgovora:', error.response ? error.response.headers : 'Ni na voljo');
      if (error.response && error.response.status === 429 && retryCount < MAX_RETRIES) {
        const backoffTime = INITIAL_BACKOFF * Math.pow(2, retryCount);
        console.log(`Poskus ${retryCount + 1} ni uspel. Poskušam ponovno čez ${backoffTime}ms.`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return openaiService.generateResponse(message, retryCount + 1);
      }
      throw error;
    }
  }
};

export default openaiService;
