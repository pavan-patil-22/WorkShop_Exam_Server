import express from "express";
import multer from "multer";
import path from "path";
import { register, login, getAllUsers, getUserById, updateUser, deleteUser, changePassword, forgotPassword } from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";

const userrouter = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Public routes
userrouter.post("/register", upload.single("profilePic"), register);
userrouter.post("/login", login);

// Protected routes
userrouter.get("/", auth, getAllUsers);
userrouter.put("/change-password", auth, changePassword);
userrouter.post("/forgot-password", forgotPassword);


userrouter.get("/:id", auth, getUserById);
userrouter.put("/:id", auth, upload.single("profilePic"), updateUser);
userrouter.delete("/:id", auth, deleteUser);

export default userrouter;
