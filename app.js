const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const app = express();
app.use(bodyParser.json());

app.post('/sendNotification', (req, res) => {
    const { token, title, body } = req.body;
  
    const message = {
      notification: {
        title: title, 
        body: body, 
      },
      android: {
        notification: {
          click_action: 'FLUTTER_NOTIFICATION_CLICK', 
          actions: [
            {
              title: 'Reply',
              action: 'REPLY_ACTION',
              type: 'text',
            },
          ],
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: title,
              body: body,
            },
            category: 'REPLY_ACTION',
          },
        },
      },
      token: token, 
    };

    admin.messaging()
      .send(message)
      .then((response) => {
        res.status(200).send({ message: 'Notification sent successfully', response });
      })
      .catch((error) => {
        console.error('Error sending notification:', error);
        res.status(500).send({ message: 'Error sending notification', error });
      });
});

const PORT = 5555;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
