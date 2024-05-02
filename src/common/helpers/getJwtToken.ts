import { JwtPayload } from "src/auth/interfaces/jwt-payload.interface";


export const  getJwtToken= ( payload: JwtPayload,JwtService ) => {
        
    const token = JwtService.sign( payload );
    console.log(token)
    return token;

  }