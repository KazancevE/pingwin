const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, replyMarkup = null) {
  try {
    const payload = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    };

    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }

    const response = await axios.post(`${TELEGRAM_API}/sendMessage`, payload);
    console.log(`✅ Message sent to ${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Send message error:', error.response?.data || error.message);
    throw error;
  }
}

async function answerCallbackQuery(callbackQueryId) {
  try {
    await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
      callback_query_id: callbackQueryId
    });
  } catch (error) {
    console.error('Answer callback error:', error);
    throw error;
  }
}

module.exports = {
  sendMessage,
  answerCallbackQuery
};