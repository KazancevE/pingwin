const express = require('express');
const router = express.Router();
const webhookHandler = require('./handlers/webhookHandler');

// Webhook endpoint
router.post('/webhook', webhookHandler.handleWebhook);

// Set webhook (call this once when deploying)
router.post('/set-webhook', webhookHandler.setWebhook);

// Get bot info
router.get('/info', webhookHandler.getBotInfo);

// Delete webhook
router.delete('/webhook', webhookHandler.deleteWebhook);

module.exports = router;