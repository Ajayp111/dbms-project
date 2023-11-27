import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Get all users (for demonstration purposes)
export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// User registration
export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;

  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.json({ msg: "Registration Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// User login
export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });

    if (!user[0]) {
      return res.status(404).json({ msg: "Email not found" });
    }

    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });

    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;

    // Create access token and refresh token
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15s" }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Update user's refresh token in the database
    await Users.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );

    // Set refresh token as an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Respond with the access token
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
// User logout
export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user[0]) {
      return res.sendStatus(401); // Unauthorized
    }

    const userId = user[0].id;

    // Clear the user's refresh token in the database
    const [rowsAffected] = await Users.update(
      { refresh_token: null },
      { where: { id: userId } }
    );

    if (rowsAffected === 0) {
      console.log("Failed to update user's refresh token");
      return res.sendStatus(500); // Internal Server Error
    }

    // Clear the refresh token cookie
    res.clearCookie("refreshToken");

    return res.sendStatus(200); // OK
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export default {
  getUsers,
  Register,
  Login,
  Logout,
};
