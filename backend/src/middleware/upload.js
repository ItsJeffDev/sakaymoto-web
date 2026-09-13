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

const createUpload = (destination) => multer({
    storage: multer.diskStorage({
        destination,
    filename: (req, file, cb) => {
        const uniqueName =
            `${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/') && destination !== uploadUser) {
            return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'));
        }
        cb(null, true);
    },
});

module.exports = {
    motorcycleUpload: createUpload(uploadMotor),
    documentUpload: multer({
        storage: multer.diskStorage({
            destination: uploadUser,
            filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`),
        }),
        limits: { fileSize: 8 * 1024 * 1024 },
    }),
    profileUpload: createUpload(uploadUserProfile),
};