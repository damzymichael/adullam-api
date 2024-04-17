import {InferSchemaType, model, Schema} from 'mongoose';

const studentSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: [true, 'Email address already exists'],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid Email address'
      ]
    },
    fullName: {type: String, required: [true, 'Full name is required']},
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      minLength: 11
    },
    password: {type: String, required: [true, 'Password is required']},
    admissionStatus: {
      type: String,
      enum: ['not-admitted', 'under-review', 'admitted'],
      default: 'not-admitted'
    },
    program: {type: String, enum: ['online', 'on-campus'], require: true},
    emailVerified: {type: Boolean, default: false}
  },
  {timestamps: true}
);

type Student = InferSchemaType<typeof studentSchema>;

export default model<Student>('Student', studentSchema);
