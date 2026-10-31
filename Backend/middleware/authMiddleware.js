import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
  try {
    const t = req.headers.authorization?.split(" ")[1];
    if (!t) return res.status(401).json({ msg: "No token" });

    const d = jwt.verify(t, process.env.JWT_SECRET);
    req.u = await User.findById(d.id).select("-password");

    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
}; 

export const admin = (req, res, next) => {
  if (req.u?.role === "Admin") next();
  else res.status(403).json({ msg: "Admin only" });
};