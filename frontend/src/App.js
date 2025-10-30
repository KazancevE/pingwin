import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function App() {
  const [health, setHealth] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
    loadUsers();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await axios.get(`${API_URL}/health`);
      setHealth(response.data);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealth({ status: 'ERROR', error: error.message });
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load users:', error);
      setLoading(false);
    }
  };

  const setWebhook = async () => {
    try {
      const response = await axios.post(`${API_URL}/bot/set-webhook`);
      alert(`Webhook set: ${JSON.stringify(response.data)}`);
    } catch (error) {
      alert(`Error setting webhook: ${error.message}`);
    }
  };

  const getBotInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/bot/info`);
      alert(`Bot info: ${JSON.stringify(response.data)}`);
    } catch (error) {
      alert(`Error getting bot info: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <Header />
      
      <div className="container">
        <section className="health-section">
          <h2>Статус системы</h2>
          {health ? (
            <div className={`health-status ${health.status === 'OK' ? 'healthy' : 'error'}`}>
              <p><strong>Статус:</strong> {health.status}</p>
              <p><strong>Время:</strong> {new Date(health.timestamp).toLocaleString()}</p>
              {health.services && (
                <div>
                  <p><strong>Сервисы:</strong></p>
                  <ul>
                    <li>База данных: {health.services.database}</li>
                    <li>Telegram Bot: {health.services.bot}</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p>Проверка статуса...</p>
          )}
        </section>

        <section className="bot-controls">
          <h2>Управление ботом</h2>
          <div className="button-group">
            <button onClick={setWebhook} className="btn btn-primary">
              Установить Webhook
            </button>
            <button onClick={getBotInfo} className="btn btn-secondary">
              Информация о боте
            </button>
          </div>
        </section>

        <section className="users-section">
          <h2>Пользователи системы</h2>
          {loading ? (
            <p>Загрузка пользователей...</p>
          ) : (
            <div className="users-grid">
              {users.map(user => (
                <div key={user._id} className="user-card">
                  <h3>{user.firstName} {user.lastName}</h3>
                  <p><strong>Роль:</strong> {user.role}</p>
                  <p><strong>Email:</strong> {user.email || 'Не указан'}</p>
                  <p><strong>Telegram ID:</strong> {user.telegramId || 'Не привязан'}</p>
                  <p><strong>Статус:</strong> {user.isActive ? '✅ Активен' : '❌ Неактивен'}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="features">
          <h2>Возможности платформы</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📚 Домашние задания</h3>
              <p>Выдача, выполнение и проверка домашних заданий</p>
            </div>
            <div className="feature-card">
              <h3>📅 Расписание</h3>
              <p>Управление расписанием занятий и консультаций</p>
            </div>
            <div className="feature-card">
              <h3>📊 Отслеживание прогресса</h3>
              <p>Мониторинг успеваемости студентов</p>
            </div>
            <div className="feature-card">
              <h3>🏢 Управление филиалами</h3>
              <p>Многопользовательская система с разными ролями</p>
            </div>
            <div className="feature-card">
              <h3>🤖 Telegram бот</h3>
              <p>Удобное взаимодействие через мессенджер</p>
            </div>
            <div className="feature-card">
              <h3>🔐 Безопасность</h3>
              <p>SSL шифрование и защита данных</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;