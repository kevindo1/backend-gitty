const pool = require('../utils/pool');

module.exports = class Posts {
  id;
  text;

  constructor(row) {
    this.id = row.id;
    this.text = row.text;
  }

  static async getPosts() {
    const { rows } = await pool.query(
      `
        SELECT * 
        FROM posts
      `
    );
    return rows.map((row) => new Posts(row));
  }

  static async createPosts({ text }) {
    const { rows } = await pool.query(
      `
        INSERT INTO
          posts(text)
        VALUES 
          ($1)
        RETURNING 
          *
      `,
      [text]
    );
    return new Posts(rows[0]);
  }
};
