const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require('jimp');
const { nanoid } = require("nanoid");

const { User } = require("../models/user");

const { HttpError, sendEmail } = require('../helpers');
const { ctrlWrapper } = require('../decorators');
const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars")


const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(user) {
        throw HttpError(409, "Email is already exist");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`
    };

    await sendEmail(verifyEmail)

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({verificationToken});
    if(!user) {
        throw HttpError(404, "User not found")
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""})
    res.json({
        message: 'Verification successful',
    })
};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(404, "User not found")
    }
    if(user.verify) {
        throw HttpError(400, "Verification has already been passed")
    }
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`
    };

    await sendEmail(verifyEmail)

    res.json({
        message: 'Verification email sent',
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});

    if(!user) {
        throw HttpError(401, "Wrong email or password")
    }

    if(!user.verify) {
        throw HttpError(401, "User not found")
    }

    const passwordCompare = bcrypt.compare(password, user.password);
    
    if(!passwordCompare) {
        throw HttpError(401, "Wrong email or password")
    }

    const payload = {
        id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token })
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        }
    })
};

const getCurrent = async (req, res) => {
    const {email, subscription} = req.user;

    res.json({
        email,
        subscription,
    })
};

const logout = async (req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate( _id, {token: ""})

    res.json({
        message: "Logout Success"
    })
}

const updateAvatar = async (req, res) => {
    const {_id} = req.user;
    const { path: tempUpload, originalname } = req.file;

    const avatar = await Jimp.read(tempUpload)
    await avatar
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(tempUpload)

    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, {avatarURL});

    res.json({
        avatarURL,
    })
}

module.exports = {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}