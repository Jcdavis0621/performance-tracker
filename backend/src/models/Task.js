const db = require('../db');

class Task {
  static async findAll(userId) {
    const result = await db.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows.map(row => ({
      ...row,
      skills: row.skills ? JSON.parse(row.skills) : [],
    }));
  }

  static async findById(id, userId) {
    const result = await db.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (result.rows.length > 0) {
      return {
        ...result.rows[0],
        skills: result.rows[0].skills ? JSON.parse(result.rows[0].skills) : [],
      };
    }
    return null;
  }

  static async create(userId, taskData) {
    const {
      name, description, status, priority, pie, quarter,
      reviewPeriod, requestor, objective, impact, visibility,
      evidence, feedback, skills,
    } = taskData;

    const result = await db.query(
      `INSERT INTO tasks (user_id, name, description, status, priority, pie, quarter,
        review_period, requestor, objective, impact, visibility, evidence, feedback, skills)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [userId, name, description, status, priority, pie, quarter,
        reviewPeriod, requestor, objective, impact, visibility,
        evidence, feedback, JSON.stringify(skills || [])]
    );

    return {
      ...result.rows[0],
      skills: result.rows[0].skills ? JSON.parse(result.rows[0].skills) : [],
    };
  }

  static async update(id, userId, taskData) {
    const {
      name, description, status, priority, pie, quarter,
      reviewPeriod, requestor, objective, impact, visibility,
      evidence, feedback, skills,
    } = taskData;

    const result = await db.query(
      `UPDATE tasks SET name = $1, description = $2, status = $3, priority = $4,
        pie = $5, quarter = $6, review_period = $7, requestor = $8, objective = $9,
        impact = $10, visibility = $11, evidence = $12, feedback = $13, skills = $14,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $15 AND user_id = $16
       RETURNING *`,
      [name, description, status, priority, pie, quarter,
        reviewPeriod, requestor, objective, impact, visibility,
        evidence, feedback, JSON.stringify(skills || []), id, userId]
    );

    if (result.rows.length > 0) {
      return {
        ...result.rows[0],
        skills: result.rows[0].skills ? JSON.parse(result.rows[0].skills) : [],
      };
    }
    return null;
  }

  static async delete(id, userId) {
    const result = await db.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows.length > 0;
  }

  static async getByQuarter(userId, quarter) {
    const result = await db.query(
      'SELECT * FROM tasks WHERE user_id = $1 AND quarter = $2 ORDER BY created_at DESC',
      [userId, quarter]
    );
    return result.rows.map(row => ({
      ...row,
      skills: row.skills ? JSON.parse(row.skills) : [],
    }));
  }

  static async getStats(userId) {
    const result = await db.query(
      `SELECT status, COUNT(*) as count FROM tasks WHERE user_id = $1 GROUP BY status`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = Task;
