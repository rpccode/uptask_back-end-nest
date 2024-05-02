import { Document } from "mongoose";

export type proyect = Document & {
    ProyectName: string,
    clientName: string
    description: string
}