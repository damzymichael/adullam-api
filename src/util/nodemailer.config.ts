import nodemailer from 'nodemailer';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';
import env from '../util/env';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: env.ADMIN_EMAIL,
    pass: env.ADMIN_PASSWORD
  }
});

const handlebarOptions: hbs.NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    extname: '.handlebars',
    partialsDir: path.resolve(__dirname, '../views/partials'),
    defaultLayout: false
  },
  viewPath: path.resolve(__dirname, '../views'),
  extName: '.handlebars'
};

transporter.use('compile', hbs(handlebarOptions));

export default transporter;
