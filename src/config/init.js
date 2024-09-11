import { config } from 'dotenv';
config();
import Config from './main';
import { CreateProDir } from './initDir';

for (const key in Config) {
  if (Config[key] === undefined || Config[key] === '') {
    throw new Error(`Environment variable '${key}' not found`);
  }
}

CreateProDir();
