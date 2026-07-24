import bcrypt from "bcrypt";
import db from "../models/index.js";

const { User, UserWeight } = db;
const SALT_ROUNDS = 10;

const userWithWeightsInclude = [
  {
    model: UserWeight,
    as: "user_weights",
  },
];

export async function getUserById(id) {
  return User.findOne({
    where: { id },
    include: userWithWeightsInclude,
  });
}

export async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) return null;

  const {
    gender,
    username,
    first_name,
    last_name,
    birthdate,
    height,
    target_weight,
    email,
    password,
  } = data;

  const payload = {};
  if (gender !== undefined) payload.gender = gender;
  if (username !== undefined) payload.username = username;
  if (first_name !== undefined) payload.first_name = first_name;
  if (last_name !== undefined) payload.last_name = last_name;
  if (birthdate !== undefined) payload.birthdate = birthdate;
  if (height !== undefined) payload.height = height;
  if (target_weight !== undefined) payload.target_weight = target_weight;
  if (email !== undefined) payload.email = email;
  if (password !== undefined && password !== "") {
    payload.password = await bcrypt.hash(password, SALT_ROUNDS);
  }

  await user.update(payload);

  return getUserById(id);
}

export async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) return false;
  await user.destroy();
  return true;
}
