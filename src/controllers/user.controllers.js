import {
  getUserService,
  registerUserService,
  loginService,
  getAllUsersService
} from "../services/user.service.js";

export function getUserController(req, res) {
  res.status(200).send(getUserService());
}

export async function setUserController(req, res) {
  res.status(201).send(await registerUserService(req.body));
}

export async function LoginController(req, res) {
  const user = await loginService(req);
  res.status(user.status).send(user.message);
}


export async function getAllUsersController(req, res){
    res.status(200).send(await getAllUsersService())
}