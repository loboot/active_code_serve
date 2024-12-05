import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface Configuration {
  port: number;
  database: TypeOrmModuleOptions;
}

export default (): Configuration => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3006,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    entities: [join(__dirname + '/../**/*.entity{.ts,.js}')],
    synchronize: false,
  },
});
