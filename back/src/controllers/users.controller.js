import db from "../models/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname,"..","..","public","uploads","avatars");

const { User, UserWeight } = db;

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: UserWeight,
          as: "user_weights",
        },
      ],
    });
    res.status(200).json({
      success: true,
      message: "Les utilisateurs ont été récupérés avec succès",
      data: users,
    });
  } catch (error) {
    // console.log("Erreur getUsers", error);    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: UserWeight,
          as: "user_weights",
        },
      ],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "L'utilisateur n'a pas été trouvé",
      });
    }
    res.status(200).json({
      success: true,
      message: "L'utilisateur a été récupéré avec succès",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const {
      gender,
      username,
      first_name,
      last_name,
      age,
      height,
      email,
      password,
    } = req.body;

    const payload = {
      gender,
      username,
      first_name,
      last_name,
      age,
      height,
      email,
      password,
      avatar: req.file ? req.file.filename : null,
    };

    const user = await User.create(payload);
    const userWithWeights = await User.findOne({
      where: { id: user.id },
      include: [
        {
          model: UserWeight,
          as: "user_weights",
        },
      ],
    });
    res.status(201).json({
      success: true,
      message: "L'utilisateur a été créé avec succès",
      data: userWithWeights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "L'utilisateur n'a pas été trouvé",
      });
    }
    const {
      gender,
      username,
      first_name,
      last_name,
      age,
      height,
      email,
      password,
    } = req.body;

    const payload = {
      gender,
      username,
      first_name,
      last_name,
      age,
      height,
      email,
      password,
    };

    if (req.file) {
      payload.avatar = req.file.filename;
    }

    await user.update(payload);
    const updatedUser = await User.findOne({
      where: { id },
      include: [
        {
          model: UserWeight,
          as: "user_weights",
        },
      ],
    });
    res.status(200).json({
      success: true,
      message: "L'utilisateur a été mis à jour avec succès",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "L'utilisateur n'a pas été trouvé",
      });
    }
    if (user.avatar) {
      const imagePath = path.join(uploadPath, user.avatar);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error(`Impossible de supprimer ${imagePath}`, err);
        }
      }
    }
    await user.destroy();
    res.status(200).json({
      success: true,
      message: "L'utilisateur a été supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
