import 'dotenv/config';
import express, {Request, Response, NextFunction} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import env from './util/env';
import studentRoutes from './routes/student';
import createHttpError, {isHttpError} from 'http-errors';

const homeMessage = `
  <div style="display: flex; align-items: center; justify-content: center; height: 90vh"> 
    <h1 style="font-size: 72px; background: -webkit-linear-gradient(45deg, #09009f, #00ff95 80%); -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;">Adullam REST API</h1>
  </div>
`;

const app = express();

app.use(helmet());

export const devMode = app.get('env') === 'development';

export const DB_URI = devMode
  ? 'mongodb://localhost:27017/adullam'
  : env.DB_URI;

export const BASE_URL = devMode ? 'http://localhost:4000' : '';

app.use(morgan('dev'));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get('/', (req, res) => res.status(200).send(homeMessage));
app.use('/student', studentRoutes);

//Not found
app.use((req, res, next) => next(createHttpError(404, 'Endpoint not found')));

//Error Middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = 'An unknown error occurred';
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json(errorMessage);
});

export default app;
