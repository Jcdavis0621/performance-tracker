const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

class User {
  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(email, password, name) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, role, created_at',
      [email, hashedPassword, name]
    );
    return result.rows[0];
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static generateToken(userId, email, name) {
    return jwt.sign({ userId, email, name }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }
}

module.exports = User;
