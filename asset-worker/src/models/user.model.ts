import mongoose, { Schema, Document, Model } from 'mongoose';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError';

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  const expiry = process.env.ACCESS_TOKEN_EXPIRY;
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!expiry) {
    throw new ApiError(500, 'ACCESS_TOKEN_EXPIRY is not defined');
  }

  if (!secret) {
    throw new ApiError(500, 'ACCESS_TOKEN_SECRET is not defined');
  }
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    secret as string,
    {
      expiresIn: expiry as SignOptions['expiresIn'],
    },
  );
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
