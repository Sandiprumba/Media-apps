//CRON IS A TIME BASED JOB SCHEDULER
import cron from "cron";
import https from "https";

const URL = "https://media-apps-byb6.onrender.com";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(URL, (res) => {
      if (res.statusCode === 200) {
        console.log("GET req sent successfully ");
      } else {
        console.log("GET request failed ", res.statusCode);
      }
    })
    .on("error", (e) => {
      console.log("Error while sending request", e);
    });
});

export default job;
