import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  _id:string
  name: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
