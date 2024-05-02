import { Prop, SchemaFactory,Schema } from "@nestjs/mongoose";
import { Document, Types} from "mongoose";
import { types } from "util";

export type TokenDocument = Token & Document;

@Schema()
export class Token extends Document {
    @Prop({

        required: true,
        trim: true,
    })
    token: string
    @Prop({
        type:Types.ObjectId,
        ref:'User'
    })
    user: string
    @Prop({

       type:Date,
       default: Date.now(),
       expires:'10m'
    })
    CreateAt: Date

}

export const TokenSchema = SchemaFactory.createForClass(Token);
