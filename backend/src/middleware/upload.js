const multer = require("multer");
const path = require("path");
const { mkdirSync } = require("fs");

const uploadDir = "uploads";
const uploadMotor = "uploads/motorcycles";
const uploadUser = "uploads/users";
const uploadUserProfile = "uploads/users/profile";

mkdirSync(uploadDir, { recursive: true });
mkdirSync(uploadMotor, { recursive: true });
mkdirSync(uploadUser, { recursive: true });
mkdirSync(uploadUserProfile, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        if (req.uploadType === "motorcycle") {
            cb(null, uploadMotor);

        } else if (req.uploadType === "user") {
            cb(null, uploadUser);

        } else if (req.uploadType === "profile") {
            cb(null, uploadUserProfile);

        } else {
            cb(null, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName =
            `${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

module.exports = upload;