export const verifyToken = (token: string): boolean => {
  return token === process.env.BEARER_TOKEN;
};
