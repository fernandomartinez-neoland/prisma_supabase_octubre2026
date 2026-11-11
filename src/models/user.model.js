import { db } from "../prisma/db.ts";
export function getUserModel() {
  return "getUserModel";
}

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
