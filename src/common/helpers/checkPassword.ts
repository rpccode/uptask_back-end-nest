
import * as bcrypt from 'bcryptjs';
export const checkPassword = async (enteredPassword: string, storedHash: string) => {
    return await bcrypt.compare(enteredPassword, storedHash)
}