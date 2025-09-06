import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    usn: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true, unique: true },
    profilePic: { type: String, default: "" },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
