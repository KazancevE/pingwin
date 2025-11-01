const { getRoleText } = require('../keyboards/mainKeyboards');

function getWelcomeMessage(user) {
  return `
👋 Добро пожаловать в IT-Школу, ${user.firstName}!

Ваша роль: ${getRoleText(user.role)}

Используйте меню ниже для навигации или команды:
/menu - Главное меню
/homework - Домашние задания
/help - Помощь
/test - Проверить работу бота
  `.trim();
}

const HELP_MESSAGE = `
🤖 **Помощь по боту IT-Школы**

**Основные команды:**
/start - Начать работу
/menu - Показать главное меню  
/help - Показать эту справку
/homework - Показать домашние задания
/schedule - Показать расписание
/test - Проверить работу бота

📞 Техническая поддержка: support@genius-school.ru

Если у вас возникли проблемы, обратитесь к администратору.
`.trim();

module.exports = {
  getWelcomeMessage,
  HELP_MESSAGE
};