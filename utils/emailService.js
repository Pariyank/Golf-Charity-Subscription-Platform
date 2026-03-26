const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendWinnerEmail = async (user, prize, drawMonth) => {
  await resend.emails.send({
    from: 'Golf Charity <rewards@yourdomain.com>',
    to: user.email,
    subject: `Congratulations! You won in the ${drawMonth} Draw! 🏆`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #0B132B;">
        <h1>You're a Winner, ${user.name}!</h1>
        <p>Your golf scores matched this month's draw.</p>
        <div style="background: #F8FAFC; padding: 20px; border-radius: 12px; border: 1px solid #3A86FF;">
          <h2 style="margin: 0;">Prize Amount: ₹${prize.toLocaleString()}</h2>
        </div>
        <p>Log in to your dashboard to upload your proof and claim your reward.</p>
        <a href="${process.env.CLIENT_URL}/dashboard/winnings" 
           style="background: #3A86FF; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 20px;">
           Claim Reward
        </a>
      </div>
    `
  });
};