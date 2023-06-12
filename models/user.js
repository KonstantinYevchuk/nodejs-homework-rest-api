const { Schema, model } = require("mongoose");
const Joi = require('joi');
const { handleMongooseError } = require("../helpers");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const userSchema = new Schema ({

        password: {
          type: String,
          minlength: 6,
          required: [true, 'Password is required'],
        },
        email: {
          type: String,
          match: emailRegexp,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter",
        },
        token: {
          type: String,
          default: null,
        },
        avatarURL: {
            type: String,
            required: true,
        },
        verify: {
          type: Boolean,
          default: false,
        },
        verificationToken: {
          type: String,
          required: [true, 'Verify token is required'],
        },
      }, {versionKey: false, timestamps: true});


      userSchema.post("save", handleMongooseError);

      const registerJoiSchema = Joi.object({
        email: Joi.string().pattern(emailRegexp).messages({"any.required": `missing required email field`}),
        password: Joi.string().min(6).required().messages({"any.required": `missing required phone field`}),
        subscription: Joi.string().validate("starter", "pro", "business"),
      });

      const emailJoiSchema = Joi.object({
        email: Joi.string().pattern(emailRegexp).messages({"any.required": `missing required email field`}),
      });

      const loginJoiSchema = Joi.object({
        email: Joi.string().pattern(emailRegexp).messages({"any.required": `missing required email field`}),
        password: Joi.string().min(6).required().messages({"any.required": `missing required phone field`}),
      });

      const schemas = {
        registerJoiSchema,
        loginJoiSchema,
        emailJoiSchema,
      };

      const User = model("user", userSchema);

      module.exports = {
        User, 
        schemas,
      }