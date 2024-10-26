import { DataSource } from 'typeorm';
import { Contact } from './entity/Contact';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'db',
  url: process.env.DATABASE_URL,
  port: 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'postgres',
  entities: [Contact],
  synchronize: true,
  poolSize: 250,
});
