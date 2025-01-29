const Role = require("../../config/role");
const UserModel = require("../../models/UserModel");
const RoleModel = require("../../models/RoleModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService {
  /**
   * Creates a new user and saves it to the database.
   * @param {Object} req - The request object containing user details in the body.
   * @param {Object} res - The response object for sending back the result.
   * @throws {Error} - If required fields are missing, user already exists, role doesn't exist, or an error occurs during creation.
   */
  static createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const userExists = await UserModel.findOne({ email: email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    const roleExists = await RoleModel.findOne({ roleName: role });
    if (!roleExists) {
      return res.status(400).json({ message: "Role does not exist." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      roleId: roleExists._id,
      roleName: roleExists.roleName,
    });

    try {
      await newUser.save();
      res
        .status(201)
        .json({ message: "User created successfully.", user: newUser });
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

      const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
      const token = jwt.sign(
        { id: user._id, role: user.roleName },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful.",
        token,
        user: {
          id: user._id,
          name: user.name,
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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const role = await RoleModel.findOne({ roleName }).session(session);
      if (!role) {
        throw new Error("Role not found");
      }

      const user = await UserModel.findById(userId).session(session);
      if (!user) {
        throw new Error("User not found");
      }

      user.roleId = role._id;
      user.roleName = role.roleName;
      user.permissions = role.grants;

      await user.save({ session });
      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
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
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    for (let key in updateData) {
      if (user[key] && updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    }

    return await user.save();
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

module.exports = UserService;
