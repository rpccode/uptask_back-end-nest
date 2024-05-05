import { Types } from "mongoose"

export interface INote extends Document {
    content: string
    createdBy: Types.ObjectId
    task: Types.ObjectId
}