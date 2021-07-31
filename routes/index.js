import express from "express";
// middlewares
import { encode } from "../middlewares/jwt.js";

const router = express.Router();

router.post("/login", encode, (req, res, next) => {
  return res.status(200).json({
    success: true,
    msg: "LoggedIn",
    token: req.authToken,
    expiresIn: 86400,
    userId: req.user._id,
    type: req.user.type
  });
});

export default router;
