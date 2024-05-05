import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"
import { UserDocument } from "src/user/Models/user.schema";
import { Note, NoteDocument, NoteSchema } from "./note.schema";

export const taskStatus = {
    PENDING: "pending",
    ON_HOLD: "onHold",
    IN_PROGRESS: "inProgress",
    UNDER_REVIEW: "underReview",
    COMPLETE: "complete"
} as const

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]
export type TaskDocument = Task & Document;

@Schema({
    timestamps: true
})
export class Task extends Document {
   
    @Prop({

        required: true,
        trim: true
    })
    TaskName: string
    @Prop({
        type: Types.ObjectId,
        ref: 'Proyect',
        required: true,
        trim: true
    })
    proyect: string

    @Prop({
        required: true,
        trim: true
    })
    description: string

    @Prop({
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING

    })
    status: string
    @Prop({
        type: [{
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }],
        default: []
    })
    completedBy: {
        user: Types.ObjectId | UserDocument | null,
        status: TaskStatus
    }[];

    @Prop({
        type: [
            {
                type: Types.ObjectId,
                ref: 'Note'
            }
        ],
        default: []
    })
    notes: Types.ObjectId[] | NoteDocument[];

    @Prop({

        default: true,
        trim: true
    })
    IsActive: boolean


}



export const TaskSchema = SchemaFactory.createForClass(Task);


