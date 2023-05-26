const { Contact } = require("../models/contact");
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');


  const getAllContacts = async (req, res) => {
      const { _id: owner } = req.user;
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
      const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "email subscription");
      res.json(result);
  };

  const getContactById = async (req, res) => {
      const { id } = req.params;
      const result = await Contact.findById(id);
      if(!result) {
        throw HttpError(404, `Contact with ${id} not found`);
      }
      res.json(result)
  };

  const addContact = async (req, res) => {
      const { _id: owner } = req.user;
      const result = await Contact.create({...req.body, owner});
      res.status(201).json(result)
  };

  const updateContact = async (req, res, next) => {
      const { id } = req.params;
      const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
      if(!result) {
        throw HttpError(404, `Contact with ${id} not found`);
      }
      res.json(result)
  };

  const updateFavorite = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if(!result) {
      throw HttpError(404, `Not found`);
    }
    res.json(result)
};

  const deleteContact = async (req, res) => {
    
      const { id } = req.params;
      const result = await Contact.findByIdAndRemove(id);
      if(!result) {
        throw HttpError(404, `Contact with ${id} not found`);
      }
      res.json({
        message: "Delete success"
      })
  };

  module.exports = {
    getAllContacts: ctrlWrapper(getAllContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    updateFavorite: ctrlWrapper(updateFavorite),
    deleteContact: ctrlWrapper(deleteContact),
  }