const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");

exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await User.findById(req.user.id);

    const priceId = plan === "monthly" 
      ? process.env.STRIPE_MONTHLY_PRICE_ID 
      : process.env.STRIPE_YEARLY_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscribe`,
      metadata: { userId: user._id.toString(), plan }
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;

  switch (event.type) {
    case "checkout.session.completed":
      await User.findByIdAndUpdate(session.metadata.userId, {
        subscriptionStatus: "active",
        subscriptionType: session.metadata.plan,
        stripeCustomerId: session.customer
      });
      break;
    
    case "customer.subscription.deleted":
      await User.findOneAndUpdate({ stripeCustomerId: session.customer }, {
        subscriptionStatus: "inactive",
        subscriptionType: "none"
      });
      break;
  }

  res.json({ received: true });
};