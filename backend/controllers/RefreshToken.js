import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(401); // Unauthorized
    }

    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user[0]) {
      return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      { issuer: "your-issuer", audience: "your-audience" },
      async (err, decoded) => {
        if (err) {
          console.log("Error verifying refresh token:", err);
          return res.sendStatus(403); // Forbidden
        }

        console.log("Decoded refresh token:", decoded);

        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;

        // Create a new access token
        const accessToken = jwt.sign(
          { userId, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15s",
          }
        );

        // Include the expiration time in the response
        const expiresIn = decoded.exp;

        // Clear the old refresh token in the database
        await Users.update({ refresh_token: null }, { where: { id: userId } });

        // Set the new refresh token as an HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          domain: "yourdomain.com", // Set the correct domain
          path: "/", // Set the correct path
          sameSite: "strict", // or "lax" depending on your requirements
        });

        // Respond with the new access token and its expiration time
        res.json({ accessToken, expiresIn });
      }
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500); // Internal Server Error
  }
};
