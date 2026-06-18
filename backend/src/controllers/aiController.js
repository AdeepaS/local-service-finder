const aiService = require('../services/aiService');

const handleChat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const aiResponse = await aiService.getChatResponse(history, message);

    res.status(200).json({
      success: true,
      data: aiResponse
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleChat
};
