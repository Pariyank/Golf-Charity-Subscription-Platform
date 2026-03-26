const cron = require("node-cron");
const { runDraw } = require("../controllers/drawController");

// Runs every month (1st day midnight)
cron.schedule("0 0 1 * *", async () => {
  console.log("Running Monthly Draw...");
  await runDraw({ body: { type: "random" } }, { json: () => {} });
});