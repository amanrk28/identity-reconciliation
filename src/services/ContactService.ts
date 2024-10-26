import { AppDataSource } from "../data-source"
import { Contact } from "../entity/Contact"

export const identifyAndLinkContact = async ({ phoneNumber, email }: { phoneNumber: string | null, email: string | null }) => {
  const contactRepo = AppDataSource.getRepository(Contact);

  const existingContacts = await contactRepo.find({
    where: [
      { phoneNumber: phoneNumber ?? undefined },
      { email: email ?? undefined }
    ]
  });

  let primaryContact: Contact | null = null;
  const primaryContacts = existingContacts.filter(c => c.linkPrecedence === 'primary');

  if (primaryContacts.length > 0) {
    primaryContact = primaryContacts.reduce((oldest, contact) =>
      contact.createdAt < oldest.createdAt ? contact : oldest
    );

    for (const contact of existingContacts) {
      if (contact.id !== primaryContact.id) {
        contact.linkedId = primaryContact.id;
        contact.linkPrecedence = 'secondary';
        await contactRepo.save(contact);
      }
    }


  } else {
    primaryContact = new Contact();
    if (phoneNumber != null) {
      primaryContact.phoneNumber = phoneNumber;
    }
    if (email != null) {
      primaryContact.email = email;
    }
    primaryContact.linkPrecedence = 'primary';
    await contactRepo.save(primaryContact);
  }

  const allLinkedContacts = await contactRepo.find({
    where: [{ linkedId: primaryContact.id }, { id: primaryContact.id }]
  });

  // Prepare the response format
  const emails = allLinkedContacts
    .map(contact => contact.email)
    .filter(email => email !== null) as string[];
  const phoneNumbers = allLinkedContacts
    .map(contact => contact.phoneNumber)
    .filter(phone => phone !== null) as string[];
  const secondaryContactIds = allLinkedContacts
    .filter(contact => contact.linkPrecedence === 'secondary')
    .map(contact => contact.id);

  return {
    contact: {
      primaryContactId: primaryContact.id,
      email: emails,
      phoneNumber: phoneNumbers,
      secondaryContactIds
    }
  }
}
