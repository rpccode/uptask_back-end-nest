import { Prop, SchemaFactory,Schema, } from "@nestjs/mongoose";
import { Document, Types } from "mongoose"

export type UserDocument = User & Document;

@Schema({
    timestamps: true
})
export class User extends Document {
    @Prop({

        required: true,
        trim: true,
        unique:true,
        lowercase: true
    })
    email: string
    @Prop({
        required: true,
        trim: true
    })
    password: string
    @Prop({
        required: true,
        trim: true
    })
    firtsName: string
    @Prop({
        required: true,
        trim: true
    })
    lastName: string

    @Prop({
        trim: true,
        default: null
    })
    token: string
    @Prop({

        default: false,
        trim: true
    })
    IsConfirmed: boolean
    @Prop({

        default: true,
        trim: true
    })
    IsActive: boolean


}

export const UserSchema = SchemaFactory.createForClass(User);
