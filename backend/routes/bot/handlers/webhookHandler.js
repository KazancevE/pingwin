const axios = require('axios');
const messageHandler = require('./messageHandler');
const callbackHandler = require('./callbackHandler');

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function handleWebhook(req, res) {
  try {
    console.log('📨 Received webhook update:', req.body);
    const update = req.body;
    
    if (update.message) {
      await messageHandler.handleMessage(update.message);
    } else if (update.callback_query) {
      await callbackHandler.handleCallbackQuery(update.callback_query);
    }
    
    res.send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
}

async function setWebhook(req, res) {
  try {
    const webhookUrl = process.env.BOT_WEBHOOK_URL || 'http://localhost:3000/api/bot/webhook';
    const response = await axios.post(`${TELEGRAM_API}/setWebhook`, {
      url: webhookUrl
    });
    
    console.log('✅ Webhook set:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Set webhook error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getBotInfo(req, res) {
  try {
    const response = await axios.get(`${TELEGRAM_API}/getMe`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteWebhook(req, res) {
  try {
    const response = await axios.post(`${TELEGRAM_API}/deleteWebhook`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleWebhook,
  setWebhook,
  getBotInfo,
  deleteWebhook
};