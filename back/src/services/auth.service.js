import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../models/index.js";

const { User } = db;
const SALT_ROUNDS = 10;
//s'enregistrer
export async function register(userData) {
  const hash = await bcrypt.hash(userData.password, SALT_ROUNDS);
  return User.create({ 
    ...userData,
    password: hash,
  });
}

export async function validateCredentials(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid ? user : null;
}

export async function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      avatar: user.avatar,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      gender: user.gender,
      height: user.height,
      created_at: user.created_at,
     },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}