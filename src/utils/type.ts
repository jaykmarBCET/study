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


interface ItemsInfo extends Document{
  title:string;
  shortUrl:string;
  index:number;
  id:string;
}
export  interface IVideo  extends Document{
   _id:string;
   listId:string;
   items:ItemsInfo[] | []
}

export interface IPlaylist extends Document{
   userId:string;
      listId:string;
      title:string;
      TotalItems:number;
      thumbnails:string;
      author:string;
}