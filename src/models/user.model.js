import { db } from "../prisma/db.ts";

export async function registerUserModel(email, name, username, password) {
  const created = await db.orm.public.User.create({
    email,
    name,
    username,
    password,
  });
  await db.close();
  return ok;
}

// getUserModel recibe un email  para poder hacer la busqueda en la BD
export async function getUserModel(email) {
  // por medio de "db.orm.public.user" se pueden hacer cualqueir cosa hacia la BD
  // usamos el where porque este nos permite enviar parametros y ubicar en la BD aqueyo que coincida con los parametros, en este caso el email que esta recibiendo el getUserModel
  const user = await db.orm.public.User.where({
    email,
  }).first();
  return user;
}


export async function getAllUsersModel(){

  const users = await db.orm.public.User.all();

  return users;

}