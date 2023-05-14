const express = require('express');
const contactsControllers = require('../../controllers/contacts-controllers');

const router = express.Router();


router.get('/', contactsControllers.getAllContacts)

router.get('/:id', contactsControllers.getContactById)

router.post('/', contactsControllers.addContact)

router.put('/:id', contactsControllers.updateContact)

router.delete('/:id', contactsControllers.deleteContact)


module.exports = router
