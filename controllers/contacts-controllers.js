// const Joi = require('joi');
const contactsService = require('../models/contacts');
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');

// const contactAddSchema = Joi.object({
//     name: Joi.string().required().messages({"any.required": `missing required name field`}),
//     email: Joi.string().required().messages({"any.required": `missing required email field`}),
//     phone: Joi.string().required().messages({"any.required": `missing required phone field`})
//   })

  const getAllContacts = async (req, res) => {
      const result = await contactsService.listContacts();
      res.json(result);
  };

  const getContactById = async (req, res, next) => {
      const { id } = req.params;
      const result = await contactsService.getContactById(id);
      if(!result) {
        throw HttpError(404, `Contact with ${id} not found`);
      }
      res.json(result)
  };

  const addContact = async (req, res, next) => {
    //   const { error } = contactAddSchema.validate(req.body);
    //   if(error) {
    //     throw HttpError(400, error.message)
    //   }
      const result = await contactsService.addContact(req.body);
      res.status(201).json(result)
  };

  const updateContact = async (req, res, next) => {
    //   const { error } = contactAddSchema.validate(req.body);
    //   if(error) {
    //     throw HttpError(400, error.message)
    //   }
      const { id } = req.params;
      const result = await contactsService.updateContact(id, req.body);
      if(!result) {
        throw HttpError(404, `Contact with ${id} not found`);
      }
      res.json(result)
  };

  const deleteContact = async (req, res, next) => {
    
      const { id } = req.params;
      const result = await contactsService.removeContact(id);
      if(!result) {
        throw HttpError(404, `Contact with ${id} not found`);
      }
      res.json({
        message: "Delete"
      })
  };

  module.exports = {
    getAllContacts: ctrlWrapper(getAllContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    deleteContact: ctrlWrapper(deleteContact),
  }