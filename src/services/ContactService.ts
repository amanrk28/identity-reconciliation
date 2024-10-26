import { AppDataSource } from "../data-source"
import { Contact } from "../entity/Contact"

export const identifyAndLinkContact = async ({ phoneNumber, email }: { phoneNumber: string | null, email: string | null }) => {
  const contactRepo = AppDataSource.getRepository(Contact);

  const matchingContacts = await contactRepo.find({
    where: [
      { phoneNumber: phoneNumber ?? undefined },
      { email: email ?? undefined }
    ]
  });

  if (matchingContacts.length === 0) {
    const newContact = new Contact();
    newContact.linkPrecedence = "primary";
    if (email) newContact.email = email;
    if (phoneNumber) newContact.phoneNumber = phoneNumber;
    const newPrimaryContact = await contactRepo.save(newContact);

    return {
      contact: {
        primaryContactId: newPrimaryContact.id,
        emails: [newPrimaryContact.email].filter(Boolean),
        phoneNumbers: [newPrimaryContact.phoneNumber].filter(Boolean),
        secondaryContactIds: []
      }
    };
  }

  const primaryContact = matchingContacts.find(contact => contact.linkPrecedence === "primary") || matchingContacts[0];
  const hasMoreThanOnePrimaryContact = matchingContacts.filter(contact => contact.linkPrecedence === "primary").length > 1;

  if (hasMoreThanOnePrimaryContact) {
    // leave the oldest primary contact as primary & update the rest to secondary
    const primaryContacts = matchingContacts.filter(contact => contact.linkPrecedence === "primary");
    const oldestPrimaryContact = primaryContacts.reduce((oldest, current) => oldest?.createdAt < current.createdAt ? oldest : current);
    const otherPrimaryContacts = primaryContacts.filter(contact => contact.id !== oldestPrimaryContact.id);

    for (const otherPrimary of otherPrimaryContacts) {
      otherPrimary.linkPrecedence = "secondary";
      otherPrimary.linkedId = oldestPrimaryContact.id;
      await contactRepo.save(otherPrimary);
    }

    return {
      contact: {
        primaryContactId: oldestPrimaryContact.id,
        emails: [oldestPrimaryContact.email, ...otherPrimaryContacts.map(c => c.email)].filter(Boolean),
        phoneNumbers: [oldestPrimaryContact.phoneNumber, ...otherPrimaryContacts.map(c => c.phoneNumber)].filter(Boolean),
        secondaryContactIds: otherPrimaryContacts.map(contact => contact.id).reduce((acc, id) => {
          if (!acc.includes(id)) {
            acc.push(id);
          }

          return acc;
        }, [] as number[]),
      }
    }
  }

  const linkedContacts = await contactRepo.find({
    where: { linkedId: primaryContact.id }
  });

  const allEmails = new Set<string>([primaryContact.email, ...linkedContacts.map(contact => contact.email)].filter(Boolean));
  const allPhoneNumbers = new Set<string>([primaryContact.phoneNumber, ...linkedContacts.map(contact => contact.phoneNumber)].filter(Boolean));
  const secondaryContactIds = linkedContacts.map(contact => contact.id);

  const isNewEmail = email && !allEmails.has(email);
  const isNewPhoneNumber = phoneNumber && !allPhoneNumbers.has(phoneNumber);

  if (isNewEmail || isNewPhoneNumber) {
    const newContact = new Contact();
    newContact.linkedId = primaryContact.id;
    newContact.linkPrecedence = "secondary";
    if (email) newContact.email = email;
    if (phoneNumber) newContact.phoneNumber = phoneNumber;
    const newSecondaryContact = await contactRepo.save(newContact);
    secondaryContactIds.push(newSecondaryContact.id);

    if (email) allEmails.add(email);
    if (phoneNumber) allPhoneNumbers.add(phoneNumber);
  }

  const primaryConflicts = matchingContacts.filter(contact => contact.id !== primaryContact.id && contact.linkPrecedence === "primary");
  if (primaryConflicts.length > 0) {
    for (const conflictingPrimary of primaryConflicts) {
      conflictingPrimary.linkPrecedence = "secondary";
      conflictingPrimary.linkedId = primaryContact.id;
      await contactRepo.save(conflictingPrimary);
      secondaryContactIds.push(conflictingPrimary.id);

      if (conflictingPrimary.email) allEmails.add(conflictingPrimary.email);
      if (conflictingPrimary.phoneNumber) allPhoneNumbers.add(conflictingPrimary.phoneNumber);
    }
  }

  return {
    contact: {
      primaryContactId: primaryContact.id,
      emails: Array.from(allEmails),
      phoneNumbers: Array.from(allPhoneNumbers),
      secondaryContactIds
    }
  };
}
