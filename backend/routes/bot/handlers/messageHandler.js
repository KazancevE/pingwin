const User = require('../../../models/User');
const telegramService = require('../services/telegramService');
const commandHandler = require('./commandHandler');

async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text || '';
  const user = message.from;

  console.log(`💬 Message from ${user.first_name} (${user.id}): ${text}`);

  try {
    // Authenticate/register user
    const dbUser = await findOrCreateUser(user);

    // Handle commands or text messages
    if (text.startsWith('/')) {
      await commandHandler.handleCommand(chatId, text, dbUser);
    } else {
      await commandHandler.handleTextMessage(chatId, text, dbUser);
    }
  } catch (error) {
    console.error('Handle message error:', error);
    await telegramService.sendMessage(chatId, '❌ Произошла ошибка. Попробуйте позже.');
  }
}

async function findOrCreateUser(telegramUser) {
  let dbUser = await User.findOne({ telegramId: telegramUser.id });
  
  if (!dbUser) {
    dbUser = new User({
      telegramId: telegramUser.id,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      username: telegramUser.username,
      role: 'student'
    });
    await dbUser.save();
    console.log(`✅ New user registered: ${telegramUser.first_name}`);
  }
  
  return dbUser;
}

module.exports = {
  handleMessage
};