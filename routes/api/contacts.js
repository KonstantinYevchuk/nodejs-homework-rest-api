const express = require('express');
const contactsControllers = require('../../controllers/contacts-controllers');

const router = express.Router();

const { schemas } = require('../../models/contact');

const { isValidId } = require("../../middleWares");

const { validateBody, validateBodyUpdate, authenticate } = require('../../decorators');



router.get('/', authenticate, contactsControllers.getAllContacts);

router.get('/:id', authenticate, isValidId, contactsControllers.getContactById);

router.post('/', authenticate, validateBody(schemas.contactJoiSchema), contactsControllers.addContact);

router.put('/:id', authenticate, isValidId, validateBodyUpdate, validateBody(schemas.contactJoiSchema), contactsControllers.updateContact);

router.patch('/:id/favorite', authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), contactsControllers.updateFavorite);

router.delete('/:id', authenticate, isValidId, contactsControllers.deleteContact);


module.exports = router;
