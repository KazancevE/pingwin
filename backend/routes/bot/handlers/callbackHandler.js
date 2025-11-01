const telegramService = require('../services/telegramService');
const homeworkService = require('../services/homeworkService');

async function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  console.log(`🔘 Callback query: ${data}`);

  try {
    // Handle different callback actions
    switch (data) {
      case 'get_homework':
        await homeworkService.showHomework(chatId, callbackQuery.from);
        break;
      case 'get_schedule':
        await telegramService.sendMessage(chatId, '📅 Функция расписания будет доступна в ближайшее время...');
        break;
      default:
        await telegramService.sendMessage(chatId, '❌ Неизвестное действие.');
    }

    // Answer callback query to remove loading state
    await telegramService.answerCallbackQuery(callbackQuery.id);
  } catch (error) {
    console.error('Callback handler error:', error);
  }
}

module.exports = {
  handleCallbackQuery
};