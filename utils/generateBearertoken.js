const crypto = require("crypto");

function generateBearerToken() {
  return crypto.randomBytes(32).toString("hex");
}

const token = generateBearerToken();
console.log(token);
