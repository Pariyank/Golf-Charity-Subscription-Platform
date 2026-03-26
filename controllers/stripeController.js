const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");

// 1. CREATE CHECKOUT SESSION
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
      // Use env variable for CLIENT_URL (Firebase URL)
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/subscribe`,
      metadata: { 
        userId: user._id.toString(), 
        plan: plan 
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 2. HANDLE WEBHOOK
exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;

  switch (event.type) {
    case "checkout.session.completed":
      // The handshake: Finding the user via metadata we sent earlier
      await User.findByIdAndUpdate(session.metadata.userId, {
        subscriptionStatus: "active",
        subscriptionType: session.metadata.plan,
        stripeCustomerId: session.customer,
        subscriptionId: session.subscription // Useful for cancellations
      });
      console.log(`✅ Subscription Activated for User: ${session.metadata.userId}`);
      break;
    
    case "customer.subscription.deleted":
      // Deactivate user when subscription ends
      await User.findOneAndUpdate({ stripeCustomerId: session.customer }, {
        subscriptionStatus: "inactive",
        subscriptionType: "none"
      });
      console.log(`❌ Subscription Deactivated for Customer: ${session.customer}`);
      break;
  }

  res.json({ received: true });
};