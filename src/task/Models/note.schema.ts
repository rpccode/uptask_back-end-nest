import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"


export type NoteDocument = Note & Document;

@Schema({
    timestamps: true
})
export class Note extends Document {
    static async deleteMany(taskId: any) {
        try {
            await this.deleteMany({ id: taskId });
        } catch (error) {
            // Handle any error that may occur during deletion
            throw new Error('Error deleting notes related to the task');
        }
    }
    @Prop({

        required: true,
        trim: true
    })
    NoteName: string
    @Prop({

        required: true,
        trim: true
    })
    content: string
    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
    })
    createdBy: string

    @Prop({
        type: Types.ObjectId,
        ref: 'Task',
        required: true,
        trim: true
    })
    task: string

    @Prop({

        default: true,
        trim: true
    })
    IsActive: boolean


}

export const NoteSchema = SchemaFactory.createForClass(Note);
