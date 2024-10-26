# Identity Reconciliation

## Overview

The **Identity Reconciliation** is a Node.js application built using TypeScript and PostgreSQL. This service helps to identify and track a customer's identity across multiple purchases using contact information such as emails and phone numbers. The service links contacts with the oldest one being treated as the primary contact.

## Features

- Identifies and links customers based on email or phone number.
- Allows for the creation of new primary or secondary contacts.
- Dynamically updates primary or secondary contacts based on linking logic.
- Dockerized setup for easy deployment.

## Server URL: https://identity-reconciliation-3o1k.onrender.com

### Backup (Deployed to AWS EC2 instance): http://alb-identity-reconciliation-42813912.ap-south-1.elb.amazonaws.com

*Update: Created an ALB with port forwarding from 80 to 3000 inside the application.

<b>Note to self: Remember to teardown AWS resources later.</b>

## API Endpoints

### `POST /identify`

**Request Body**:
```json
{
  "email": "example@domain.com",
  "phoneNumber": "1234567890"
}
```

**Response Body**:
```
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["example@domain.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": []
  }
}
```

## Author
<div>
<a href="https://github.com/amanrk28/identity-reconciliation" target="_blank">
<img src="https://avatars.githubusercontent.com/u/62303924?v=4&size=64" />
</a>
<h3>Aman Khemka
<a href="https://github.com/amanrk28/identity-reconciliation" target="_blank">@amanrk28</a></h3>
</div>