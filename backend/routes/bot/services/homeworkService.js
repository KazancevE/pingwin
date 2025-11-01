const Homework = require('../../../models/Homework');
const telegramService = require('./telegramService');

async function showHomework(chatId, user) {
  try {
    switch (user.role) {
      case 'student':
        await showStudentHomework(chatId, user);
        break;
      case 'teacher':
        await showTeacherHomework(chatId, user);
        break;
      case 'parent':
        await showParentHomework(chatId, user);
        break;
      case 'director':
      case 'admin':
        await showAllHomework(chatId, user);
        break;
      default:
        await telegramService.sendMessage(chatId, '❌ Функция домашних заданий недоступна для вашей роли.');
    }
  } catch (error) {
    console.error('Show homework error:', error);
    await telegramService.sendMessage(chatId, '❌ Ошибка при загрузке домашних заданий.');
  }
}

async function showStudentHomework(chatId, user) {
  let homework = await Homework.find({
    $or: [
      { assignedTo: user._id },
      { assignedToGroup: user.group }
    ]
  }).populate('assignedBy', 'firstName lastName');

  if (homework.length === 0) {
    // Create test homework only for students
    const testHomework = new Homework({
      title: "Первое задание по Python",
      description: "Напишите программу, которая выводит 'Hello, World!'",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

  await telegramService.sendMessage(chatId, message);
}

async function showTeacherHomework(chatId, user) {
  const homework = await Homework.find({
    assignedBy: user._id
  })
  .populate('assignedTo', 'firstName lastName')
  .populate('assignedToGroup', 'name');

  if (homework.length === 0) {
    await telegramService.sendMessage(chatId, '📝 Вы еще не выдавали домашних заданий.');
    return;
  }

  let message = '📚 Выданные домашние задания:\n\n';
  homework.forEach((hw, index) => {
    message += `${index + 1}. ${hw.title}\n`;
    message += `   📝 ${hw.description}\n`;
    if (hw.assignedTo) {
      message += `   👨‍🎓 Ученик: ${hw.assignedTo.firstName} ${hw.assignedTo.lastName}\n`;
    }
    if (hw.assignedToGroup) {
      message += `   👥 Группа: ${hw.assignedToGroup.name}\n`;
    }
    if (hw.deadline) {
      message += `   📅 До: ${new Date(hw.deadline).toLocaleDateString('ru-RU')}\n`;
    }
    message += `   📊 Статус: ${hw.status || 'не сдано'}\n`;
    message += '\n';
  });

  await telegramService.sendMessage(chatId, message);
}

async function showParentHomework(chatId, user) {
  await telegramService.sendMessage(chatId, '📚 Функция просмотра домашних заданий детей будет доступна после настройки связи с детскими профилями.');
}

async function showAllHomework(chatId, user) {
  const homework = await Homework.find({
    organization: user.organization
  })
  .populate('assignedBy', 'firstName lastName')
  .populate('assignedTo', 'firstName lastName')
  .populate('assignedToGroup', 'name');

  if (homework.length === 0) {
    await telegramService.sendMessage(chatId, '📝 В вашей организации еще нет домашних заданий.');
    return;
  }

  let message = '📚 Все домашние задания в организации:\n\n';
  homework.forEach((hw, index) => {
    message += `${index + 1}. ${hw.title}\n`;
    message += `   📝 ${hw.description}\n`;
    message += `   👨‍🏫 Преподаватель: ${hw.assignedBy.firstName} ${hw.assignedBy.lastName}\n`;
    if (hw.assignedTo) {
      message += `   👨‍🎓 Ученик: ${hw.assignedTo.firstName} ${hw.assignedTo.lastName}\n`;
    }
    if (hw.assignedToGroup) {
      message += `   👥 Группа: ${hw.assignedToGroup.name}\n`;
    }
    if (hw.deadline) {
      message += `   📅 До: ${new Date(hw.deadline).toLocaleDateString('ru-RU')}\n`;
    }
    message += `   📊 Статус: ${hw.status || 'не сдано'}\n`;
    message += '\n';
  });

  await telegramService.sendMessage(chatId, message);
}

module.exports = {
  showHomework
};