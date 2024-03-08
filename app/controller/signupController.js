import bcrypt from "bcrypt";
import Users from "../models/users.model.js";
import Randomstring from "randomstring";
import nodemailer from "nodemailer";
const Singup = (req, res) => {
  res.render("signup");
};
const otpArray = new Set();
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Randomstring.generate({
      length: 6,
      charset: "numeric",
    });

    const subject = "OTP for Anime Hub";
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: #333;">OTP Verification</h2>
        <p style="font-size: 16px; color: #666;">Hello,</p>
        <p style="font-size: 16px; color: #666;">Your OTP for verification is:</p>
        <div style="text-align: center; font-size: 24px; margin-top: 20px; padding: 10px; background-color: #fff; border-radius: 8px;">${otp}</div>
        <p style="font-size: 16px; color: #666;">Please use this OTP to complete your registration.</p>
        <p style="font-size: 16px; color: #666;">Thank you!</p>
      </div>
    `;

    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transport.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: htmlBody,
    });

    otpArray.add(otp);
    res.send({ success: true, data: "OTP has been sent" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (!otpArray.has(otp))
      return res.send({ success: false, data: "invalid OTP" });
    otpArray.delete(otp);
    console.log(otp);
    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { signupController, Singup, verifyOtp, sendOtp };
