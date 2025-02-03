import UserModel from "../models/UserModel.js";
import RoleModel from "../models/RoleModel.js";
import bcrypt from "bcrypt";
import { generateSecureToken } from "../helpers/index.js";

class UserService {
  /**
   * Creates a new user and saves it to the database.
   * @param {Object} req - The request object containing user details in the body.
   * @param {Object} res - The response object for sending back the result.
   * @throws {Error} - If required fields are missing, user already exists, role doesn't exist, or an error occurs during creation.
   */
  static createUser = async (req, res) => {
    try {
      const { fullName, email, password, role, hourlyRate = 0 } = req.body;

      if (!fullName || !email || !password || !role) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      if (role === "freelancer" && !hourlyRate) {
        return res
          .status(400)
          .json({ message: "Hourly rate is required for freelancer." });
      }

      const userExists = await UserModel.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists." });
      }

      const roleExists = await RoleModel.findOne({ roleName: role });
      if (!roleExists) {
        return res.status(400).json({ message: "Role does not exist." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        fullName,
        email,
        password: hashedPassword,
        roleId: roleExists._id,
        roleName: roleExists.roleName,
        ...(role === "freelancer" && { hourlyRate }),
      });

      await newUser.save();

      res.status(201).json({
        message: "User created successfully.",
        user: {
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.roleName,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating user.", error: error.message });
    }
  };

  /**
   * Authenticates a user and generates a JWT token.
   * @param {Object} req - The request object containing email and password in the body.
   * @param {Object} res - The response object for sending back the result.
   * @returns {Object} - The authenticated user's information and token.
   * @throws {Error} - If email/password are missing, invalid, or an error occurs during authentication.
   */
  static login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password." });
    }

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      const jwtPayload = { userId: user._id, userRole: user.roleName };
      const token = await generateSecureToken(jwtPayload);

      res.status(200).json({
        message: "Login successful.",
        token,
        user: {
          id: user._id,
          name: user.fullName,
          email: user.email,
          role: user.roleName,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed.", error: error.message });
    }
  };

  /**
   * Assigns a role to a user by their ID.
   * @param {String} userId - The ID of the user.
   * @param {String} roleName - The name of the role to assign.
   * @returns {Object} - The updated user object.
   * @throws {Error} - If the role or user is not found, or an error occurs during assignment.
   */
  static assignRoleToUser = async (userId, roleName) => {
    try {
      const role = await RoleModel.findOne({ roleName });
      if (!role) {
        throw new Error("Role not found");
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          roleId: role._id,
          roleName: role.roleName,
          permissions: role.grants,
        },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Error assigning role: ${error.message}`);
    }
  };

  /**
   * Updates a user's details by their ID.
   * @param {String} userId - The ID of the user to update.
   * @param {Object} updateData - The data to update for the user.
   * @returns {Object} - The updated user object.
   * @throws {Error} - If the user is not found or an error occurs during the update.
   */
  static updateUser = async (userId, updateData) => {
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    }
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  };

  /**
   * Retrieves all users from the database.
   * @returns {Array} - The list of all users.
   * @throws {Error} - If an error occurs during retrieval.
   */
  static getAllUsers = async () => {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      throw new Error("Error retrieving users.");
    }
  };

  /**
   * Deletes a user by their ID.
   * @param {String} userId - The ID of the user to delete.
   * @returns {Object} - The deleted user object.
   * @throws {Error} - If the user is not found or an error occurs during deletion.
   */
  static deleteUser = async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await user.remove();
    return user;
  };
}

export default UserService;
