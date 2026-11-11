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
