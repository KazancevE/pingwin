const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Homework = require('../models/Homework');

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Webhook endpoint - Telegram will send updates here
router.post('/webhook', async (req, res) => {
  try {
    console.log('📨 Received webhook update:', req.body);
    const update = req.body;
    
    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }
    
    res.send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

// Set webhook (call this once when deploying)
router.post('/set-webhook', async (req, res) => {
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
});

// Get bot info
router.get('/info', async (req, res) => {
  try {
    const response = await axios.get(`${TELEGRAM_API}/getMe`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete webhook
router.delete('/webhook', async (req, res) => {
  try {
    const response = await axios.post(`${TELEGRAM_API}/deleteWebhook`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Message handler
async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text || '';
  const user = message.from;

  console.log(`💬 Message from ${user.first_name} (${user.id}): ${text}`);

  try {
    // Authenticate/register user
    let dbUser = await User.findOne({ telegramId: user.id });
    if (!dbUser) {
      dbUser = new User({
        telegramId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        role: 'student'
      });
      await dbUser.save();
      console.log(`✅ New user registered: ${user.first_name}`);
    }

    // Handle commands
    if (text.startsWith('/')) {
      await handleCommand(chatId, text, dbUser);
    } else {
      await handleTextMessage(chatId, text, dbUser);
    }
  } catch (error) {
    console.error('Handle message error:', error);
    await sendMessage(chatId, '❌ Произошла ошибка. Попробуйте позже.');
  }
}

// Command handler
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
      await showHomework(chatId, user);
      break;
    case '/schedule':
      await sendMessage(chatId, '📅 Функция расписания будет доступна в ближайшее время...');
      break;
    case '/test':
      await sendMessage(chatId, '✅ Бот работает корректно!');
      break;
    default:
      await sendMessage(chatId, '❌ Неизвестная команда. Используйте /help для справки.');
  }
}

// Text message handler
async function handleTextMessage(chatId, text, user) {
  const menuItems = {
    '📚 Мои домашние задания': () => showHomework(chatId, user),
    '📅 Мое расписание': () => sendMessage(chatId, '📅 Функция расписания будет доступна в ближайшее время...'),
    '🏢 Мои филиалы': () => showBranches(chatId, user),
    '📊 Статистика филиала': () => sendMessage(chatId, '📊 Статистика будет доступна после настройки аналитики...'),
    '🆘 Помощь': () => sendHelpMessage(chatId),
    '👋 Тест': () => sendMessage(chatId, '✅ Тестовое сообщение работает!')
  };

  if (menuItems[text]) {
    await menuItems[text]();
  } else {
    await showMainMenu(chatId, user);
  }
}

// Send welcome message
async function sendWelcomeMessage(chatId, user) {
  const welcomeText = `
👋 Добро пожаловать в IT-Школу, ${user.firstName}!

Ваша роль: ${getRoleText(user.role)}

Используйте меню ниже для навигации или команды:
/menu - Главное меню
/homework - Домашние задания
/help - Помощь
/test - Проверить работу бота
  `.trim();

  await sendMessage(chatId, welcomeText);
  await showMainMenu(chatId, user);
}

// Show main menu with keyboard
async function showMainMenu(chatId, user) {
  const keyboard = getKeyboardByRole(user.role);
  
  await sendMessage(chatId, getMenuTextByRole(user.role), keyboard);
}

// Show homework
async function showHomework(chatId, user) {
  try {
    // Create some test homework if none exists
    let homework = await Homework.find({
      $or: [
        { assignedTo: user._id },
        { assignedToGroup: user.group }
      ]
    }).populate('assignedBy', 'firstName lastName');

    if (homework.length === 0) {
      // Create test homework
      const testHomework = new Homework({
        title: "Первое задание по Python",
        description: "Напишите программу, которая выводит 'Hello, World!'",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        assignedBy: user._id,
        assignedTo: user._id,
        organization: user.organization,
        branch: user.branch
      });
      await testHomework.save();
      homework = [testHomework];
    }

    let message = '📚 Ваши домашние задания:\n\n';
    homework.forEach((hw, index) => {
      message += `${index + 1}. ${hw.title}\n`;
      message += `   📝 ${hw.description}\n`;
      if (hw.deadline) {
        message += `   📅 До: ${new Date(hw.deadline).toLocaleDateString('ru-RU')}\n`;
      }
      message += '\n';
    });

    await sendMessage(chatId, message);
  } catch (error) {
    console.error('Show homework error:', error);
    await sendMessage(chatId, '❌ Ошибка при загрузке домашних заданий.');
  }
}

// Show branches for director
async function showBranches(chatId, user) {
  if (user.role !== 'director' && user.role !== 'admin') {
    await sendMessage(chatId, '❌ Эта функция доступна только руководителям и администраторам.');
    return;
  }

  try {
    const Branch = require('../models/Branch');
    const branches = await Branch.find({ 
      $or: [
        { director: user._id },
        { organization: user.organization }
      ]
    }).populate('organization', 'name')
      .populate('director', 'firstName lastName');

    if (branches.length === 0) {
      await sendMessage(chatId, '🏢 Филиалы не найдены.');
      return;
    }

    let message = '🏢 Филиалы:\n\n';
    branches.forEach((branch, index) => {
      message += `${index + 1}. ${branch.name}\n`;
      message += `   📍 ${branch.address || 'Адрес не указан'}\n`;
      message += `   📞 ${branch.contactPhone || 'Телефон не указан'}\n`;
      if (branch.director) {
        message += `   👨‍💼 Руководитель: ${branch.director.firstName} ${branch.director.lastName}\n`;
      }
      message += '\n';
    });

    await sendMessage(chatId, message);
  } catch (error) {
    console.error('Show branches error:', error);
    await sendMessage(chatId, '❌ Ошибка при загрузке филиалов.');
  }
}

// Send help message
async function sendHelpMessage(chatId) {
  const helpText = `
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

  await sendMessage(chatId, helpText);
}

// Utility function to send message
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
  }
}

// Get keyboard by role
function getKeyboardByRole(role) {
  const keyboards = {
    student: {
      keyboard: [
        ['📚 Мои домашние задания', '📅 Мое расписание'],
        ['🆘 Помощь', '👋 Тест']
      ],
      resize_keyboard: true
    },
    parent: {
      keyboard: [
        ['📊 Прогресс детей', '📅 Расписание детей'],
        ['💬 Консультации', '👨‍👦 Мои дети']
      ],
      resize_keyboard: true
    },
    teacher: {
      keyboard: [
        ['✏️ Выдать ДЗ', '✅ Проверить ДЗ'],
        ['📊 Написать отчет', '📅 Мое расписание']
      ],
      resize_keyboard: true
    },
    director: {
      keyboard: [
        ['🏢 Мои филиалы', '📊 Статистика филиала'],
        ['👥 Персонал', '📈 Общая аналитика']
      ],
      resize_keyboard: true
    },
    admin: {
      keyboard: [
        ['⚙️ Настройки системы', '👥 Пользователи'],
        ['🏢 Организации', '📊 Мониторинг']
      ],
      resize_keyboard: true
    }
  };

  return keyboards[role] || {
    keyboard: [['🆘 Помощь', '👋 Тест']],
    resize_keyboard: true
  };
}

// Get menu text by role
function getMenuTextByRole(role) {
  const menus = {
    student: '👨‍🎓 Главное меню ученика',
    parent: '👨‍👩‍👧‍👦 Главное меню родителя', 
    teacher: '👨‍🏫 Главное меню преподавателя',
    director: '🏢 Главное меню руководителя',
    admin: '⚙️ Главное меню администратора'
  };
  return menus[role] || 'Главное меню';
}

// Get role text
function getRoleText(role) {
  const roles = {
    student: '👨‍🎓 Ученик',
    parent: '👨‍👩‍👧‍👦 Родитель',
    teacher: '👨‍🏫 Преподаватель',
    director: '🏢 Руководитель',
    admin: '⚙️ Администратор'
  };
  return roles[role] || 'Пользователь';
}

// Handle callback queries (for inline buttons)
async function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  console.log(`🔘 Callback query: ${data}`);

  // Handle different callback actions
  switch (data) {
    case 'get_homework':
      await showHomework(chatId, callbackQuery.from);
      break;
    case 'get_schedule':
      await sendMessage(chatId, '📅 Функция расписания будет доступна в ближайшее время...');
      break;
    default:
      await sendMessage(chatId, '❌ Неизвестное действие.');
  }

  // Answer callback query to remove loading state
  try {
    await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
      callback_query_id: callbackQuery.id
    });
  } catch (error) {
    console.error('Answer callback error:', error);
  }
}

module.exports = router;