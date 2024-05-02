import { Date, Types } from "mongoose";

export interface IToken  {
    token: string;
    user:Types.ObjectId,
    CreateAt:Date
    // TODO: añadir todo lo que quieran grabar.
}