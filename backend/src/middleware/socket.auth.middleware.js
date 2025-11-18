import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) return next(new Error("Unauthorized - No Token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return next(new Error("User not found"));

    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
};
