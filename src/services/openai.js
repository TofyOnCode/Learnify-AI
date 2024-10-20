import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const openaiService = {
  generateResponse: async (prompt, chatHistory) => {
    try {
      const response = await axios.post(OPENAI_API_URL, {
        model: "gpt-3.5-turbo",
        messages: [
          ...chatHistory,
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Napaka pri generiranju odgovora:', error);
      throw error;
    }
  },

  generateResponseWithImage: async (prompt, chatHistory, imageUrl) => {
    try {
      const response = await axios.post(OPENAI_API_URL, {
        model: "gpt-4",
        messages: [
          ...chatHistory,
          { 
            role: "user", 
            content: `${prompt}\n\nSlika: ${imageUrl}\n\nProsim, analiziraj to sliko in odgovori na vprašanje.` 
          }
        ],
        max_tokens: 300
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Napaka pri generiranju odgovora z sliko:', error);
      throw error;
    }
  }
};

export default openaiService;
