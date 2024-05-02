import { createParamDecorator, BadRequestException } from '@nestjs/common';
import { ObjectIdPipe } from './object-id.pipe';

export const ObjectIdParam = (paramName: string) =>
  createParamDecorator((data, req) => {
    const id = req.params[paramName];
    const objectIdPipe = new ObjectIdPipe();
    try {
      return objectIdPipe.transform(id);
    } catch (error) {
      throw new BadRequestException('Invalid ObjectId');
    }
  });
