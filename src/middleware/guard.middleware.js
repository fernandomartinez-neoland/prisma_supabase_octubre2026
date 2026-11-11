import { verfyToken } from "../services/token/token.service.js";
export function validateUser(req, res, next) {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    verfyToken(token);
    next();
  } catch (e) {
    res.status(401).send("error de token");
  }
}
