import db from "../models/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

import { calculateMaxWeight, calculateMinWeight, getStartingWeight, calculateIMC } from "../utils/weight/algoWeight.js";
import { getDaysSinceFirstMeasure, getMeasuresCount, getWeightLastWeek, getWeightLastMonth } from "../utils/dates/algoDate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "uploads",
  "avatars"
);

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

export const createNewUserWeight = async (req, res) => {
    const { weight } = req.body;
    const userWeight = await UserWeight.create({
      weight: weight,
      user_id: req.user.id,
    });
    res.status(201).json({
      success: true,
      message: "Le poids de l'utilisateur a été créé avec succès",
      data: userWeight,
    });
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

export const getUserStats = async (req, res) => {
    const { id } = req.params;

    const [
      startingWeight,
      maxWeight,
      minWeight,
      daysSinceFirst,
      measuresCount,
      diffWeek,
      diffMonth,
      user,
      latestWeightRow,
    ] = await Promise.all([
      getStartingWeight(id),
      calculateMaxWeight(id),
      calculateMinWeight(id),
      getDaysSinceFirstMeasure(id),
      getMeasuresCount(id),
      getWeightLastWeek(id),
      getWeightLastMonth(id),
      User.findByPk(id),
      UserWeight.findOne({
        where: { user_id: id },
        order: [["measured_at", "DESC"]],
      }),
    ]);

    let imc = null;
    if (user && user.height && latestWeightRow && latestWeightRow.weight) {
      try {
        imc = calculateIMC(
          Number(latestWeightRow.weight),
          Number(user.height),
        );
      } catch {
        imc = null;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Statistiques de poids récupérées avec succès",
      data: {
        imc,
        startingWeight,
        maxWeight,
        minWeight,
        daysSinceFirstMeasure: daysSinceFirst,
        measuresCount,
        weightLastWeek: diffWeek,
        weightLastMonth: diffMonth,
      },
  });
};
