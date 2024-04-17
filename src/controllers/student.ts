import {Request} from 'express';
import {BASE_URL} from '../app';
import Student from '../models/Student';
import {Controller} from '../util/requestHandler.config';
import transporter from '../util/nodemailer.config';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from '../util/env';

interface Register {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  program: 'online' | 'on-campus';
}

type Login = Pick<Register, 'email' | 'password'>;

interface JwtPayload {
  _id: string;
}

interface VerifyEmailQuery {
  userId: string;
  token: string;
}

export default Controller({
  async register(req: Request<any, any, Register>, res) {
    const {email, phoneNumber, password} = req.body;

    const exists = await Student.findOne({$or: [{email}, {phoneNumber}]});

    if (exists)
      throw createHttpError(403, 'Account already exists, please login');

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      ...req.body,
      password: hashedPassword
    });

    if (!student) throw createHttpError(403, 'Sign up unsuccessful');

    const {_id, fullName, password: sPassword} = student;

    const secret = env.JWT_SECRET + sPassword;
    const token = jwt.sign({_id}, secret, {expiresIn: '20m'});

    const emailVerifyUrl = `${BASE_URL}/verify-email?userId=${_id}&token=${token}`;

    const mailOptions = {
      from: env.ADMIN_EMAIL,
      to: student.email,
      subject: 'Registration successful',
      context: {name: fullName.split(' ')[1], emailVerifyUrl},
      template: 'signup'
    };

    await transporter.sendMail(mailOptions);

    res.status(201).send('Registration successful');
  },

  async login(req: Request<unknown, unknown, Login>, res) {
    const {email, password} = req.body;
  },

  async verifyEmail(req, res) {
    const {userId, token} = req.query;

    const student = await Student.findById(userId);

    if (!student) throw createHttpError(403, 'User not available');

    if (student.emailVerified)
      return res.status(200).json('User is already verified');

    const secret = env.JWT_SECRET + student.password;

    const {_id} = jwt.verify(token as string, secret) as JwtPayload;

    if (!_id) throw createHttpError(403, 'Link expired, request new link');

    const updatedStudent = await Student.findByIdAndUpdate(_id, {
      emailVerified: true
    });

    if (!updatedStudent)
      throw createHttpError(400, 'Could not update user details');

    res.status(202).json('Email verified successfully');
  }
});
