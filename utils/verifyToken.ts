const BEARER_TOKEN = process.env.BEARER_TOKEN; // Store your secret key securely

export const verifyToken = (token: string) => {
  token === BEARER_TOKEN ? true : false;
};
