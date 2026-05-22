import transporter from '../config/email.js';

// ─── Send Email Verification ───────────────────────────────────────
export const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  try {
    await transporter.sendMail({
      from: `"Auth System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello, ${name}!</h2>
          <p>Thank you for registering. Please verify your email address by clicking the button below.</p>
          <a 
            href="${verifyUrl}" 
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #4f46e5;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            "
          >
            Verify Email
          </a>
          <p>This link expires in <strong>24 hours.</strong></p>
          <p>If you did not create an account, ignore this email.</p>
        </div>
      `,
    });
    console.log('Verification email sent successfully');
  } catch (error) {
    console.log('Email sending error:', error.message);
    throw error;
  }
};

// ─── Send Password Reset Email ─────────────────────────────────────
export const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hello, ${name}!</h2>
        <p>We received a request to reset your password. Click the button below to set a new one.</p>
        <a 
          href="${resetUrl}" 
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #4f46e5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          "
        >
          Reset Password
        </a>
        <p>This link expires in <strong>1 hour.</strong></p>
        <p>If you did not request a password reset, ignore this email.</p>
      </div>
    `,
  });
};