const mongoose = require('mongoose');
const Organization = require('../models/Organization');
const Branch = require('../models/Branch');
const User = require('../models/User');
const Group = require('../models/Group');
const Homework = require('../models/Homework');

require('dotenv').config();

async function initDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_db');
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional)
    await User.deleteMany({});
    await Organization.deleteMany({});
    await Branch.deleteMany({});
    await Group.deleteMany({});
    await Homework.deleteMany({});

    // Create organization
    const organization = new Organization({
      name: "Детская IT Школа Genius",
      description: "Обучение программированию для детей 8-15 лет",
      contactEmail: "info@genius-school.ru",
      contactPhone: "+79991234567",
      address: "г. Москва, ул. Образцовая, 123"
    });

    await organization.save();
    console.log('✅ Organization created:', organization.name);

    // Create admin user
    const admin = new User({
      firstName: "Иван",
      lastName: "Петров",
      email: "admin@genius-school.ru",
      role: "admin",
      organization: organization._id
    });

    await admin.save();
    console.log('✅ Admin user created');

    // Create director user
    const director = new User({
      firstName: "Мария",
      lastName: "Сидорова", 
      email: "director@genius-school.ru",
      role: "director",
      organization: organization._id
    });

    await director.save();
    console.log('✅ Director user created');

    // Create branch
    const branch = new Branch({
      name: "Центральный филиал",
      organization: organization._id,
      director: director._id,
      address: "г. Москва, ул. Центральная, 45",
      contactPhone: "+79997654321",
      contactEmail: "central@genius-school.ru"
    });

    await branch.save();
    console.log('✅ Branch created:', branch.name);

    // Create teacher
    const teacher = new User({
      firstName: "Алексей",
      lastName: "Козлов",
      email: "teacher@genius-school.ru",
      role: "teacher",
      organization: organization._id,
      branch: branch._id
    });

    await teacher.save();
    console.log('✅ Teacher user created');

    // Create student
    const student = new User({
      firstName: "Сергей",
      lastName: "Иванов",
      email: "student@genius-school.ru", 
      role: "student",
      organization: organization._id,
      branch: branch._id
    });

    await student.save();
    console.log('✅ Student user created');

    // Create group
    const group = new Group({
      name: "Python для начинающих",
      description: "Основы программирования на Python для детей 10-12 лет",
      organization: organization._id,
      branch: branch._id,
      teacher: teacher._id,
      students: [student._id],
      schedule: [
        { dayOfWeek: 1, time: "16:00", duration: 90 },
        { dayOfWeek: 3, time: "16:00", duration: 90 }
      ],
      course: {
        name: "Python Basics",
        level: "beginner", 
        duration: 24
      }
    });

    await group.save();
    console.log('✅ Group created:', group.name);

    // Update student with group
    student.group = group._id;
    await student.save();

    // Create sample homework
    const homework = new Homework({
      title: "Первое задание по Python",
      description: "Напишите программу, которая выводит 'Hello, World!' на экран",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedBy: teacher._id,
      assignedToGroup: group._id,
      organization: organization._id,
      branch: branch._id
    });

    await homework.save();
    console.log('✅ Homework created');

    console.log('🎉 Database initialized successfully!');
    console.log('📊 Created:');
    console.log('  - 1 organization');
    console.log('  - 1 branch'); 
    console.log('  - 4 users (admin, director, teacher, student)');
    console.log('  - 1 group with schedule');
    console.log('  - 1 homework assignment');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();