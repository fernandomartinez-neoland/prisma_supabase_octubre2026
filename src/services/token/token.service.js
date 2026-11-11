import jwt from "jsonwebtoken";

export function createToken() {
  const token = jwt.sign({ nombre: "pepito", apellido: "perez" }, "123");
  return token;
}

export function verfyToken(token) {
  try {
    var decoded = jwt.verify(token, "shhhhh");
    return "ok";
  } catch (e) {
    throw new Error("error de token");
  }
}
