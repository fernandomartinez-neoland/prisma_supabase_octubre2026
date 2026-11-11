import jwt from "jsonwebtoken";
import "dotenv/config";

export function createToken(userdata) {
  // el createToken recibe un objeto con los datos del usuario para luego usar el jwt para convertirlo en un token usando la llave de seguridad que creamos en el .env
  const token = jwt.sign(userdata, process.env.tokenKey);
  return token;
}

export function verfyToken(token) {
  try {
    var decoded = jwt.verify(token, process.env.tokenKey);
    return "ok";
  } catch (e) {
    throw new Error("error de token");
  }
}
