import Admin from "../models/Admin.js";

// Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const match = await admin.comparePassword(password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = admin.generateToken();

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Current Admin
export const getCurrentAdmin = async (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
};

// Logout
export const logoutAdmin = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};