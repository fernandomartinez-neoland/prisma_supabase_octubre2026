import { db } from "../prisma/db.ts";


export async function registerUserModel(email, name, username, password) {
  const created = await db.orm.public.User.create({
    email,
    name,
    username,
    password,
  });
  const users = await db.orm.public.User.all().toArray();
  await db.close();
  return users;
}

export async function getUserModel(email) {
  const user = await db.orm.public.User.where({
    email,
  }).first();
  return user;
}
