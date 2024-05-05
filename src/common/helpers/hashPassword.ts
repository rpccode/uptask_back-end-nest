import * as bcrypt from 'bcryptjs';
export const hashPassword =async (password:string) => await bcrypt.hashSync(password, 10)