import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/avatars");
    },

    filename: (req, file, cb) => {
        cb(null, `${req.user.username}-${Date.now()}-${file.originalname.split(" ").join("_")}`);
    }
});

// Filtre pour n’accepter que certains types MIME
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("File type not supported"));
    }
    cb(null, true);
  };

const upload = multer({ storage, fileFilter });

export default upload;