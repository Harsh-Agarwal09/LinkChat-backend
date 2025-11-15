const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequestModel = require("../models/connectionRequest");

// This will run at 6 AM in the morning everyday
cron.schedule("0 6 * * *", async () => {
  // Send emails to all people who got requests the previous day
  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    // To get unique emails i.e. remove duplicates of emails from the array
    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];

    // console.log(listOfEmails);

    for (const email of listOfEmails) {
      // Send Emails
      try {
        const res = await sendEmail.run(
          "You have pending friend requests on LinkChat!",
          `
    Hi ${email},

    You have new friend requests waiting for you on LinkChat.
    Don't miss out - log in now to connect with other developers!

    Visit:www.linkchat.work.gd

    From your LinkChat Team
    `
        );
        // console.log(res);
      } catch (err) {}
    }
  } catch (err) {
    console.error(err);
  }
});
