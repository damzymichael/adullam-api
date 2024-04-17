import {cleanEnv, email, port, str} from 'envalid';

export default cleanEnv(process.env, {
  PORT: port(),
  DB_URI: str(),
  JWT_SECRET: str(),
  ADMIN_EMAIL: email(),
  ADMIN_PASSWORD: str()
});
