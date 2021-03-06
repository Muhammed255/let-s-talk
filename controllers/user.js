// utils
import makeValidation from "@withvoid/make-validation";
// models
import UserModel, { USER_TYPES } from "../models/User.js";

export default {
  onGetAllUsers: async (req, res) => {
    try {
      const users = await UserModel.find({ _id: { $ne: req.userId } });
      // const users = await UserModel.getUsers();
      return res.status(200).json({ success: true, users });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: error });
    }
  },
  onGetUserById: async (req, res) => {
    try {
      const user = await UserModel.getUserById(req.params.id);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  onCreateUser: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          firstName: { type: types.string },
          lastName: { type: types.string },
          type: { type: types.enum, options: { enum: USER_TYPES } },
          email: { type: types.string },
          password: { type: types.string },
        },
      }));
      if (!validation.success) return res.status(400).json({ ...validation });

      const { firstName, lastName, type, email, password } = req.body;

      const checkExist = await UserModel.findOne({ email: email });
      if (checkExist) {
        return res
          .status(401)
          .json({ success: false, msg: "Email is already registerd" });
      }

      const user = await UserModel.createUser(
        firstName,
        lastName,
        type,
        email,
        password
      );
      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: error });
    }
  },
  onDeleteUserById: async (req, res) => {
    try {
      const user = await UserModel.deleteByUserById(req.params.id);
      return res.status(200).json({
        success: true,
        message: `Deleted a count of ${user.deletedCount} user.`,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
};
