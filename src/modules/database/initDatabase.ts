import { Connection } from 'typeorm';
import { Logger } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

export function initDatabase() {
  mysql
    .createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: parseInt(process.env.DB_PORT),
    })
    .then(async (conn) => {
      const [rows] = await conn.execute(
        `SHOW DATABASES LIKE '${process.env.DB_DATABASE}'`,
      );
      if (Array.isArray(rows) && rows.length === 0) {
        await conn.execute(`CREATE DATABASE ${process.env.DB_DATABASE}`);
        Logger.log(`数据库创建成功[${process.env.DB_DATABASE}]`);
      }
      await createTablesIfNotExist(conn);

      await conn.end();
    });
}

async function createTablesIfNotExist(connection: mysql.Connection) {
  // 检查表是否存在
  try {
    // 选择数据库
    await connection.query(`USE \`${process.env.DB_DATABASE}\``);

    const [rows] = await connection.query(
      `SELECT * FROM information_schema.tables 
         WHERE table_schema = ? AND table_name = 'active-code'`,
      [process.env.DB_DATABASE],
    );

    if (Array.isArray(rows) && rows.length === 0) {
      Logger.log('正在创建 active-code 表...');

      await connection.query(`
          CREATE TABLE IF NOT EXISTS \`active-code\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`activeCode\` varchar(255) NOT NULL,
            \`ip\` varchar(255) DEFAULT NULL,
            PRIMARY KEY (\`id\`),
            UNIQUE KEY \`IDX_ACTIVE_CODE\` (\`activeCode\`),
            UNIQUE KEY \`IDX_IP\` (\`ip\`)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

      Logger.log('active-code 表创建完成');
    } else {
      Logger.log('active-code 表已存在');
    }

    await connection.end();
  } catch (error) {
    Logger.error('创建表失败:', error);
    throw error;
  }
}
