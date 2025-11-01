const telegramService = require('../services/telegramService');
const homeworkService = require('../services/homeworkService');
const mainKeyboards = require('../keyboards/mainKeyboards');
const messages = require('../constants/messages');

async function handleCommand(chatId, text, user) {
  const command = text.split(' ')[0];

  switch (command) {
    case '/start':
      await sendWelcomeMessage(chatId, user);
      break;
    case '/menu':
      await showMainMenu(chatId, user);
      break;
    case '/help':
      await sendHelpMessage(chatId);
      break;
    case '/homework':
      await homeworkService.showHomework(chatId, user);
      break;
    case '/schedule':
      await telegramService.sendMessage(chatId, '📅 Функция расписания будет доступна в ближайшее время...');
      break;
    case '/test':
      await telegramService.sendMessage(chatId, '✅ Бот работает корректно!');
      break;
    default:
      await telegramService.sendMessage(chatId, '❌ Неизвестная команда. Используйте /help для справки.');
  }
}

async function handleTextMessage(chatId, text, user) {
  const menuActions = {
    '📚 Мои домашние задания': () => homeworkService.showHomework(chatId, user),
    '📅 Мое расписание': () => telegramService.sendMessage(chatId, '📅 Функция расписания будет доступна в ближайшее время...'),
    '🏢 Мои филиалы': () => showBranches(chatId, user),
    '📊 Статистика филиала': () => telegramService.sendMessage(chatId, '📊 Статистика будет доступна после настройки аналитики...'),
    '✏️ Выдать ДЗ': () => telegramService.sendMessage(chatId, '✏️ Функция выдачи ДЗ будет доступна в ближайшее время...'),
    '✅ Проверить ДЗ': () => telegramService.sendMessage(chatId, '✅ Функция проверки ДЗ будет доступна в ближайшее время...'),
    '🆘 Помощь': () => sendHelpMessage(chatId),
    '👋 Тест': () => telegramService.sendMessage(chatId, '✅ Тестовое сообщение работает!')
  };

  if (menuActions[text]) {
    await menuActions[text]();
  } else {
    await showMainMenu(chatId, user);
  }
}

async function sendWelcomeMessage(chatId, user) {
  const welcomeText = messages.getWelcomeMessage(user);
  await telegramService.sendMessage(chatId, welcomeText);
  await showMainMenu(chatId, user);
}

async function showMainMenu(chatId, user) {
  const keyboard = mainKeyboards.getKeyboardByRole(user.role);
  const menuText = mainKeyboards.getMenuTextByRole(user.role);
  await telegramService.sendMessage(chatId, menuText, keyboard);
}

async function sendHelpMessage(chatId) {
  await telegramService.sendMessage(chatId, messages.HELP_MESSAGE);
}

async function showBranches(chatId, user) {
  if (user.role !== 'director' && user.role !== 'admin') {
    await telegramService.sendMessage(chatId, '❌ Эта функция доступна только руководителям и администраторам.');
    return;
  }
  await telegramService.sendMessage(chatId, '🏢 Функция филиалов будет доступна в ближайшее время...');
}

module.exports = {
  handleCommand,
  handleTextMessage
};