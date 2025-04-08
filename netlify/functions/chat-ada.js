// netlify/functions/chat-ada.js

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("🔥 ERROR in chat-ada:", error);
  
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          message: error.message,
          stack: error.stack,
        },
      }),
    };
  }
}
