require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.use(cors({ origin: 'https://your-frontend-domain.com' })); // Change to your deployed frontend!
app.use(express.json());

const TO_NUMBER = process.env.TO_NUMBER; // Set your phone number in .env
const FROM_NUMBER = process.env.FROM_NUMBER; // Set your Twilio number in .env

app.post('/api/help', async (req, res) => {
  const {name, email, message} = req.body;
  if (!name || !email || !message) return res.status(400).json({error:"Missing fields"});
  const smsText = `EmailGen Help Request:\nFrom: ${name}\nEmail: ${email}\nMessage:\n${message}`;
  try {
    await twilioClient.messages.create({
      body: smsText,
      from: FROM_NUMBER,
      to: TO_NUMBER
    });
    res.json({ok:true});
  } catch (err) {
    res.status(500).json({error:"SMS sending failed"});
  }
});

app.listen(process.env.PORT || 3000);