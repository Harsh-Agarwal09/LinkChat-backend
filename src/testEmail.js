require("dotenv").config();
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({
  region: "ap-south-1", // Mumbai
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const params = {
  Source: "harsh@linkchat.work.gd", // Must be verified
  Destination: {
    ToAddresses: ["harshbansallovesv143@gmail.com"], // Verified recipient
  },
  Message: {
    Subject: { Data: "✅ Test Email from AWS SES via Node.js" },
    Body: {
      Html: {
        Data: "<h2>Success! 🎉</h2><p>This is a test email from your LinkChat app.</p>",
      },
      Text: { Data: "Success! This is a test email from your LinkChat app." },
    },
  },
};

(async () => {
  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log("✅ Email sent successfully:", data.MessageId);
  } catch (err) {
    console.error("❌ Error sending email:", err.message, err);
  }
})();
