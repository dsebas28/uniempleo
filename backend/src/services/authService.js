const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const studentModel = require('../models/studentModel');
const companyModel = require('../models/companyModel');

const { generateToken } = require('../utils/jwt');

const authService = {
  generateToken(user) {
    return generateToken({ id: user.id, userId: user.id, email: user.email, role: user.role });
  },

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Por favor ingresa correo y contraseña');
    }

    const user = userModel.findByEmail(email.toLowerCase().trim());
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.active) {
      throw new Error('Tu cuenta se encuentra inactiva o bloqueada por la administración');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Role-specific profile data
    let profile = null;
    if (user.role === 'student') {
      profile = studentModel.findByUserId(user.id);
    } else if (user.role === 'company') {
      profile = companyModel.findByUserId(user.id);
    }

    const token = this.generateToken(user);
    const userSafe = { id: user.id, email: user.email, role: user.role, profile };

    return { token, user: userSafe };
  },

  async registerStudent({ email, password, fullName, university, career, semester, city, phone }) {
    const existing = userModel.findByEmail(email.toLowerCase().trim());
    if (existing) {
      throw new Error('El correo electrónico ya se encuentra registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = userModel.create(email.toLowerCase().trim(), hashedPassword, 'student');

    studentModel.create(userId, { fullName, university, career, semester, city, phone });

    const user = { id: userId, email: email.toLowerCase().trim(), role: 'student' };
    const token = this.generateToken(user);

    return {
      token,
      user: {
        ...user,
        profile: { fullName, university, career, semester, city }
      }
    };
  },

  async registerCompany({ email, password, name, nit, phone, city, sector, description, mission }) {
    const existing = userModel.findByEmail(email.toLowerCase().trim());
    if (existing) {
      throw new Error('El correo electrónico ya se encuentra registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = userModel.create(email.toLowerCase().trim(), hashedPassword, 'company');

    companyModel.create(userId, { name, nit, phone, city, sector, description, mission });

    const user = { id: userId, email: email.toLowerCase().trim(), role: 'company' };
    const token = this.generateToken(user);

    return {
      token,
      user: {
        ...user,
        profile: { name, nit, city, sector, approved: 1 }
      }
    };
  },

  async getCurrentUser(userId) {
    const user = userModel.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    let profile = null;
    if (user.role === 'student') {
      profile = studentModel.findByUserId(user.id);
    } else if (user.role === 'company') {
      profile = companyModel.findByUserId(user.id);
    }

    return { id: user.id, email: user.email, role: user.role, profile };
  }
};

module.exports = authService;
