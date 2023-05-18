// const fs = require('fs/promises')

// const listContacts = async () => {}

// const getContactById = async (contactId) => {}

// const removeContact = async (contactId) => {}

// const addContact = async (body) => {}

// const updateContact = async (contactId, body) => {}

const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require('nanoid');

const contactsPath = path.join(__dirname, "contacts.json");
// console.log(contactsPath);


const listContacts = async () => {
    const data = await fs.readFile(contactsPath)
    return JSON.parse(data)
  }
  
const getContactById = async (id) => {
//   const contactId = String(id)
  const contacts = await listContacts()
  const result = contacts.find((contact) => contact.id === id)
  return result || null
  }
  
const addContact = async (data) => {
  const contacts = await listContacts()
  const newContact = {
    id: nanoid(),
    ...data,
  }
  contacts.push(newContact)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return newContact
  }
  
  const removeContact = async(id) => {
    const contacts = await listContacts()
    const index = contacts.findIndex((item) => item.id === id)
    if (index === -1) {
    return null
    }
    const [result] = contacts.splice(index, 1)
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return result
  }

  const updateContact = async (id, date) => {
    const contacts = await listContacts()
    const index = contacts.findIndex((item) => item.id === id)
    if (index === -1) {
      return null
    }
    contacts[index] = { id, ...date }
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return contacts[index]
  }

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
