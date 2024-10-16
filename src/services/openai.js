import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';

const openaiService = {
  generateResponse: async (message, chatHistory) => {
    try {
      const response = await axios.post(API_URL, {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Ste učitelj, ki odgovarja na vprašanja v slovenščini. Vedno uporabljajte slovenski jezik." },
          ...chatHistory,
          { role: "user", content: message }
        ],
        max_tokens: 150
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Napaka pri klicu OpenAI API:', error);
      throw error;
    }
  }
};

export default openaiService;
