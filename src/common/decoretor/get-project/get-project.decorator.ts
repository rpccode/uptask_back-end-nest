import { ExecutionContext, InternalServerErrorException, SetMetadata, createParamDecorator } from '@nestjs/common';

export const GetProject = createParamDecorator(
    ( data, ctx: ExecutionContext)=>{

        const req= ctx.switchToHttp().getRequest();
        const project = req.project

        if(!project)
            throw new InternalServerErrorException('Projecto no encontraado en la Request')

        return project
    }
)
