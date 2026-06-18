const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the API with the key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `You are a helpful customer service assistant for a Local Service Provider platform.
Your job is to:
1. Answer customer questions politely.
2. Suggest suitable service categories based on their problem.
3. Help customers find providers.

Available service categories:
- Plumbing
- Electrical
- Cleaning
- Painting
- Gardening
- AC Repair
- Appliance Repair
- Carpentry
- Pest Control

If a user describes a problem (e.g., "My sink is leaking", "fan is not working", "need my house cleaned"), you should reply with a helpful message AND include the exact category name in brackets like [Category: Plumbing] at the end of your response so the system can parse it.
If the user asks about unrelated topics (e.g., politics, exams, coding help), politely decline to answer and redirect them back to platform-related assistance.
Do not hallucinate categories outside the list.
Keep your responses concise and friendly.`;

const getChatResponse = async (history, message) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION
    });

    // Format history for the Gemini API
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // Parse for category suggestion
    let categorySuggestion = null;
    const categoryMatch = responseText.match(/\[Category:\s*(.+?)\]/i);

    let cleanResponse = responseText;
    if (categoryMatch) {
      // Clean up the text by removing the bracketed category tag
      cleanResponse = responseText.replace(/\[Category:\s*(.+?)\]/gi, '').trim();

      const suggested = categoryMatch[1].trim();
      // Verify it's one of the allowed categories
      const validCategories = [
        'Plumbing', 'Electrical', 'Cleaning', 'Painting',
        'Gardening', 'AC Repair', 'Appliance Repair',
        'Carpentry', 'Pest Control'
      ];

      const foundCategory = validCategories.find(c => c.toLowerCase() === suggested.toLowerCase());
      if (foundCategory) {
        categorySuggestion = foundCategory;
      }
    }

    return {
      reply: cleanResponse,
      categorySuggestion
    };
  } catch (error) {
    console.error('Error in aiService:', error);
    throw error;
  }
};

module.exports = {
  getChatResponse
};
