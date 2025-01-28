const Role = require("../../config/role");
const UserModel = require("../../models/UserModel");
const RoleModel = require("../../models/RoleModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService {
  createUser = async (req, res) => {
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
      hourlyRate: roleExists.roleName === "freelancer" ? hourlyRate : undefined,
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

  // Login method
  login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password." });
    }

    try {
      // Find user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      // Generate JWT token
      const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
      const token = jwt.sign(
        { id: user._id, role: user.roleName },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Return response with token
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

  assignRoleToUser = async (userId, roleName) => {
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

      // Update the user's role
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

  // Update a user's details
  updateUser = async (userId, updateData) => {
    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update the user with new data
    for (let key in updateData) {
      if (user[key] && updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    }

    // Save the updated user
    return await user.save();
  };

  // Delete a user by ID
  deleteUser = async (userId) => {
    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Delete the user
    await user.remove();
    return user;
  };
}

module.exports = UserService;
