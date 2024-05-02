import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulatedDoc, Types } from 'mongoose';

import { Task } from 'src/task/Models/task.schema';


export type ProyectDocument = Proyect & Document;

@Schema({
    timestamps:true
})
export class Proyect extends Document {
    @Prop({

        required: true,
        trim: true
    })
    ProyectName: string

    @Prop({

        required: true,
        trim: true
    })
    clientName: string

    @Prop({

        required: true,
        trim: true
    })
    description: string

    @Prop({
        type: [Types.ObjectId],
        ref: 'Task',
        trim: true
    })
    tasks: PopulatedDoc<Task & Document>[]
    @Prop({

        default: true,
        trim: true
    })
    IsActive: boolean
}


export const ProyectSchema = SchemaFactory.createForClass(Proyect);