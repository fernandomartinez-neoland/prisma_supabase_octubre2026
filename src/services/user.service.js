import { getUserModel, registerUserModel, getAllUsersModel } from "../models/user.model.js";
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
  //   le mandamos el email a getUserModel para que este busque en la BD un usuario que tenga ese email
  const user = await getUserModel(email);

  if (user) {
    // si el getUserModel responde con datos del usuario entonces vamos a tomar los datos que nos interesan y los guardamos en un json
    const userdata = {
      name: user.name,
      username: user.username,
      email: user.email,
    };

    // luego tomamos la clave que le llego por parametro a loginService (linea 16) y la comparamos contra la clave que nos devolvio el getUserModel cuando consiguio al usuario (razon por la cual entramos a este if)
    const pass = await bcrypt.compare(password, user.password);
    if (pass) {
      // si la clave es correcta, entonces le enviamos nuestro objeto  "userdata" al servicio "createToken"
      const token = createToken(userdata);

      //   cuando el servicio nos devuelva el token lo enviaremos como parte del mensaje que devolveremos al usuario
      return {
        status: 200,
        message: token,
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


export function getAllUsersService(){
    return getAllUsersModel();
}