const express = require('express');

const { validateBody, authenticate } = require("../../decorators");

const { upload } = require("../../middleWares");

const userController = require("../../controllers/auth-controllers");

const { schemas } = require("../../models/user");

const router = express.Router();

// SignUp

router.post("/register", validateBody(schemas.registerJoiSchema), userController.register);

router.get("/verify/:verificationToken", userController.verifyEmail);

router.post("/verify", validateBody(schemas.emailJoiSchema), userController.resendVerifyEmail);

// SingIn

router.post("/login", validateBody(schemas.loginJoiSchema), userController.login);

router.get("/current", authenticate, userController.getCurrent);

router.post("/logout", authenticate, userController.logout);

router.patch("/avatars", authenticate, upload.single("avatar"), userController.updateAvatar);

module.exports = router;