const express = require('express');
const contactsControllers = require('../../controllers/contacts-controllers');

const router = express.Router();

const { schemas } = require('../../models/contact');

const { isValidId } = require("../../middleWares");

const { validateBody, validateBodyUpdate } = require('../../decorators');



router.get('/', contactsControllers.getAllContacts);

router.get('/:id', isValidId, contactsControllers.getContactById);

router.post('/', validateBody(schemas.contactJoiSchema), contactsControllers.addContact);

router.put('/:id', isValidId, validateBodyUpdate, validateBody(schemas.contactJoiSchema), contactsControllers.updateContact);

router.patch('/:id/favorite', isValidId, validateBody(schemas.updateFavoriteSchema), contactsControllers.updateFavorite);

router.delete('/:id', isValidId, contactsControllers.deleteContact);


module.exports = router;
