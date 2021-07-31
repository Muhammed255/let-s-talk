import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// models
import UserModel from "../models/User.js";

const SECRET_KEY = "some-secret-key";

export const encode = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const checkExist = await UserModel.findOne({ email: email });
    if (!checkExist) {
      return res
        .status(401)
        .json({ success: false, msg: "Email is not registered!" });
    }

    const compare = await bcrypt.compare(password, checkExist.password);
    if (!compare) {
      return res
        .status(401)
        .json({ success: false, msg: "Incorrect password!" });
    }

    const payload = {
      userId: checkExist._id,
      userType: checkExist.type,
    };
    const authToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
    req.authToken = authToken;
    req.user = checkExist;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.error });
  }
};

export const decode = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res
      .status(400)
      .json({ success: false, message: "No access token provided" });
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    req.userId = decoded.userId;
    req.userType = decoded.type;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
