import app, {DB_URI} from './app';
import mongoose from 'mongoose';
import env from './util/env';

const PORT = env.PORT;

mongoose
  .connect(DB_URI)
  .then(() => app.listen(PORT, () => console.log('Listening on PORT ' + PORT)))
  .catch(error => console.error(error));
