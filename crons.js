const axios = require("axios");
const moment = require("moment-timezone");

const callSunrise = (bot) => {
  const sunriseFunction = async () => {
    const tomorrow = moment
      .tz("Asia/Kolkata")
      .add(1, "days")
      .format("YYYY-MM-DD");
    const sunriseResponse = await axios.get(
      `https://api.sunrise-sunset.org/json?lat=18&lng=73&formatted=0&date=${tomorrow}`
    );

    console.log(
      moment.tz(sunriseResponse.data.results.sunrise, "Asia/Kolkata")
    );

    const message = `Wake up at ${moment
      .tz(sunriseResponse.data.results.sunrise, "Asia/Kolkata")
      .add(1.75, "hours")
      .format("HH:mm")}\n
    Sleep at ${moment
      .tz(sunriseResponse.data.results.sunrise, "Asia/Kolkata")
      .add(1.75, "hours")
      .add(-8.5, "hours")
      .format("HH:mm")}
      `;

    bot.telegram.sendMessage("475757469", message);
    bot.telegram.sendMessage("-338204089", message);
  };

  const CronJob = require("cron").CronJob;
  const job = new CronJob(
    "0 21 * * *",
    function () {
      sunriseFunction();
    },
    null,
    true,
    "Asia/Kolkata"
  );
  job.start();

  sunriseFunction();
};

module.exports = {
  callSunrise,
};
