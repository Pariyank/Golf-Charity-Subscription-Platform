const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/checkout", async (req, res) => {
  const { plan } = req.body;

  let priceId;

  if (plan === "monthly") {
    priceId = process.env.STRIPE_MONTHLY_PRICE_ID;
  } else {
    priceId = process.env.STRIPE_YEARLY_PRICE_ID;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000/dashboard",
    cancel_url: "http://localhost:3000/subscribe",
  });

  res.json({ url: session.url });
});

module.exports = router;