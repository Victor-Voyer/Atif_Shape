import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../models/index.js";

const { User } = db;
const SALT_ROUNDS = 10;
//s'enregistrer
export async function register(name, email, password) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return User.create({ name, email, password: hash });
}

export async function validateCredentials(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid ? user : null;
}

export async function generateToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}