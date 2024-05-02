import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

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

        default: true,
        trim: true
    })
    IsActive: boolean


}

export const TaskSchema = SchemaFactory.createForClass(Task);
