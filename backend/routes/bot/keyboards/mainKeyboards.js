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

module.exports = {
  getKeyboardByRole,
  getMenuTextByRole,
  getRoleText
};