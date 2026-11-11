import { getUserModel, registerUserModel } from "../models/user.model.js";
import { createToken } from "./token/token.service.js";
import bcrypt from "bcrypt";
export function getUserService() {
  return getUserModel();
}
const saltRounds = 10;
export function registerUserService(body) {
  let { email, name, username, password } = body;
  password = bcrypt.hash(password, saltRounds);

  return registerUserModel(email, name, username, password);
}

export async function loginService(req) {
  const { email, password } = req.body;
  const user = await getUserModel(email);
  if (user) {
    const pass = await bcrypt.compare(password, user.password);
    if (pass) {
      return {
        status: 200,
        message: user,
      };
    } else {
      return { status: 401, message: "usuario o clave incorrecto" };
    }
  } else {
    return {
      status: 401,
      message: "usuario o clave incorrecto",
    };
  }
}
