// Netlify Functions
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event, context) {
  try {
    const { message } = JSON.parse(event.body);

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = chatCompletion.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("🔥 Chat Ada Error:", error);

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
};
