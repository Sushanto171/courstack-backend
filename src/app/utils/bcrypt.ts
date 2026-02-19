import bcrypt from 'bcrypt';

export const hashPassword = async (password: string, saltRounds = 12): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
}

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
}