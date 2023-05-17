const express = require('express');
const contactsControllers = require('../../controllers/contacts-controllers');

const router = express.Router();

const schemas = require('../../schemas/contacts-schemas');

const { validateBody, validateBodyUpdate } = require('../../decorators');

router.get('/', contactsControllers.getAllContacts)

router.get('/:id', contactsControllers.getContactById)

router.post('/', validateBody(schemas.contactAddSchema) ,contactsControllers.addContact)

router.put('/:id', validateBodyUpdate, validateBody(schemas.contactAddSchema), contactsControllers.updateContact)

router.delete('/:id', contactsControllers.deleteContact)


module.exports = router
