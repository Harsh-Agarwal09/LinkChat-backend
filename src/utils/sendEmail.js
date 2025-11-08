// utils/sendEmail.js
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

async function sendEmail() {
  const params = {
    Source: "harsh@linkchat.work.gd", // Verified sender
    Destination: {
      ToAddresses: ["harshbansallovesv143@gmail.com"], // Verified receiver
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "New Connection Request - LinkChat",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <h2>New Connection Request</h2>
            <p>Someone just sent you a connection request on <b>LinkChat</b>!</p>
            <p>Visit your dashboard to review the request.</p>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: "Someone sent you a connection request on LinkChat.",
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("✅ Email sent successfully:", response.MessageId);
    return response;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
}

module.exports = { sendEmail };
