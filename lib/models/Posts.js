const pool = require('../utils/pool');

module.exports = class Posts {
  id;
  text;

  constructor(row) {
    this.id = row.id;
    this.text = row.text;
  }

  static getPosts() {
    return pool
      .query(
        `
        SELECT * 
        FROM posts
      `
      )
      .then(({ rows }) => rows.map((row) => new Posts(row)));
  }

  static createPosts({ text }) {
    return pool
      .query(
        `
        INSERT INTO
          posts(text)
        VALUES 
          ($1)
        RETURNING 
          *
      `,
        [text]
      )
      .then(({ rows }) => new Posts(rows[0]));
  }
};
