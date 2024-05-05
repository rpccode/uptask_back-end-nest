import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PopulatedDoc, Types } from 'mongoose';
import { Note } from 'src/task/Models/note.schema';

import { Task } from 'src/task/Models/task.schema';
import { User } from 'src/user/Models/user.schema';


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
        type: Types.ObjectId,
        ref: 'User',
        trim: true
    })
    manager: PopulatedDoc<User & Document>
    @Prop({
        type: [Types.ObjectId],
        ref: 'User',
        trim: true
    })
    team: PopulatedDoc<User & Document>[]
    @Prop({

        default: true,
        trim: true
    })
    IsActive: boolean
}


 export const ProyectSchema = SchemaFactory.createForClass(Proyect);



