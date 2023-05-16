
const contactsService = require('../models/contacts');
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');


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
      const result = await contactsService.addContact(req.body);
      res.status(201).json(result)
  };

  const updateContact = async (req, res, next) => {
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