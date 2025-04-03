const nodemailer = require("nodemailer");

class Email {
  constructor(user) {
    this.to = user.email;
    this.from = process.env.MAIL_SENDER;
    this.name = user.name;
  }
  newTransport() {
    // if (process.env.NODE_ENV === "production") return 1;
    return nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    console.log("AS");
  }
  async send(subject, template) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: template,

    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(token) {
    await this.send(
      "Welcome to AceQuest",

      `<section style="max-width: 640px; padding: 24px 48px; margin: 0 auto; background-color: #ffffff; color: #1f2937; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
  <main style="margin-top: 32px;">
      <h2 style="color: #374151;">Hi ${this.name}</h2>
      <p style="margin-top: 8px; line-height: 1.75; color: #000000;">
          Verify your account to get started on <span style="font-weight: 600;">AceQuest</span>.
      </p>
      <a style="padding: 8px 24px; margin-top: 16px; font-size: 0.875rem; font-weight: 500; color: #ffffff; background-color: #000814; border-radius: 0.375rem; text-decoration: none; display: inline-block;" href="${process.env.BACKEND_URL}/api/v1/users/verify/${token}">
          Verify Account
      </a>
      <p style="margin-top: 32px; color: #000000;">
          Thanks, <br>
          AceQuest Team
      </p>
  </main>
  <footer style="margin-top: 32px;">
      <p style="margin-top: 12px; color: #9ca3af;">© ${new Date().getFullYear()} AceQuest. All Rights Reserved.</p>
  </footer>
</section>`
    );
  }
  async sendTestLink(companyName, link) {
    await this.send(
      `Hi there from ${companyName}!`,

      `<section style="max-width: 640px; padding: 24px 48px; margin: 0 auto; background-color: #ffffff; color: #1f2937; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
  <main style="margin-top: 32px;">
      <h2 style="color: #374151;">Hi ${this.name}</h2>
      <p style="margin-top: 8px; line-height: 1.75; color: #000000;">
          Thanks for applying at ${companyName}. You only have next 3 days to start your test otherwise you'll not be eligible to take the test. Click on the button below to start your test.
      </p>
      <a style="padding: 8px 24px; margin-top: 16px; font-size: 0.875rem; font-weight: 500; color: #ffffff; background-color: #000814; border-radius: 0.375rem; text-decoration: none; display: inline-block;" href="${link}">
          Start test
      </a>
      <p style="margin-top: 32px; color: #000000;">
          Thanks, <br>
          AceQuest Team
      </p>
  </main>
  <footer style="margin-top: 32px;">
      <p style="margin-top: 12px; color: #9ca3af;">© ${new Date().getFullYear()} AceQuest. All Rights Reserved.</p>
  </footer>
</section>`
    );
  }



  async sendResetPassword(resetUrl) {
    await this.send(
      "Passsword Reset",
      `
      <section style="max-width: 640px; padding: 24px 48px; margin: 0 auto; background-color: #ffffff; color: #1f2937; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
  <main style="margin-top: 32px;">
      <h2 style="color: #374151;">Hi ${this.name}</h2>
      <p style="margin-top: 8px; line-height: 1.75; color: #000000;">
      Forgot your password? Click this button to reset your password: 
      </p>
      <a style="padding: 8px 24px; margin-top: 16px; font-size: 0.875rem; font-weight: 500; color: #ffffff; background-color: #000814; border-radius: 0.375rem; text-decoration: none; display: inline-block;" href="${resetUrl}">
          Reset Password
      </a>
      <p>
      If you don't forget your password just ignore this message
      </p>

      <p style="margin-top: 32px; color: #000000;">
          Thanks, <br>
          AceQuest Team
      </p>
  </main>
  <footer style="margin-top: 32px;">
      <p style="margin-top: 12px; color: #9ca3af;">© ${new Date().getFullYear()} AceQuest. All Rights Reserved.</p>
  </footer>
</section>
   `
    );
    //forgot password
  }
}

module.exports = Email;