const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const suggestRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;

    const prompt = `
You are a cooking assistant.

Using these pantry ingredients:
${ingredients.join(", ")}

Suggest:
1. Recipe Name
2. Ingredients Used
3. Cooking Steps
4. Cooking Time
`;

    const response = await client.chat.completions.create({
      model: "google/gemma-4-26b-a4b-it:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const recipe = response.choices[0].message.content;
    res.json({
      recipe,
    });
  }catch (error) {
    console.error(error);
    res.status(500).json({
      message: "AI Error",
      error: error.message,
    });
  }
};

module.exports = { suggestRecipe };