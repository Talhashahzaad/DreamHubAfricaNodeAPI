// Verification email 

function generateVerificationEmail(verifyUrl) {
  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0;">
  <table width="100%" bgcolor="#E8B639" cellpadding="0" cellspacing="0" style="height:100vh;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="370" bgcolor="#E8B639" cellpadding="0" cellspacing="0" style="font-family:Arial,Roboto,sans-serif; margin-top:30px; margin-bottom:30px;">
          <!-- Logo and Title -->
          <tr>
            <td align="center" style="padding:20px 20px 12px 20px;">
              <img src="${process.env.FRONTEND_URL}/public/assets/logo/logo-dreamhub.png" alt="DreamHub Africa Logo" width="250" style="vertical-align:middle;">
            </td>
          </tr>
          <!-- Spacer -->
          <tr><td height="30"></td></tr>
          <!-- Verification Icon -->
          <tr>
            <td align="center">
              <img src="${process.env.FRONTEND_URL}/public/assets/logo/email-icon.png" alt="Verified" width="80" style="margin-bottom:20px;">
            </td>
          </tr>
          <!-- Main Content Table -->
          <tr>
            <td>
              <table width="90%" align="center" cellpadding="0" cellspacing="0" style="text-align: center; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding:25px;">
                    <h2 style="color:#000; font-size:22px; font-weight:600; margin:0; padding:0 0 12px 0;">Verify Your Email Address</h2>
                    <p style="color:#000; font-size:15px; margin:0; padding-bottom:7px;">
                      Thanks for signing up. Please confirm this is your email address by clicking the button below.
                    </p>
                  </td>
                </tr>
                <!-- Verify Email Button -->
                 <tr>
                    <td>&nbsp;</td>
                 </tr>
                <tr>
                  <td align="center" style="padding-bottom:22px;">
                    <a href="${verifyUrl}" style="background:#15552e; color:#fff; font-size:18px; font-weight:400; text-decoration:none; border-radius:15px; padding:14px 40px; display:inline-block;">
                      Verify Email
                    </a>
                  </td>
                </tr>
                 <tr>
                    <td>&nbsp;</td>
                 </tr>
                 <tr>
                    <td>&nbsp;</td>
                 </tr>
                 <tr>
                    <td>&nbsp;</td>
                 </tr>
                 <tr>
                    <td>&nbsp;</td>
                 </tr>
                <!-- Expiry Info -->
                <tr>
                  <td align="center" style="color:#000; font-size:13px; padding-bottom:10px;">
                    This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
                  </td>
                </tr>
                <!-- Small Footer -->
                <tr>
                  <td align="center" style="color:#000; font-size:12px; padding-bottom:8px;">
                    You are receiving this email because you registered on DreamHub Africa
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer Spacer -->
          <tr><td height="20"></td></tr>
          <tr>
            <td align="center" style="color:#000; font-size:12px; padding:12px 0;">
              © ${new Date().getFullYear()} DreamHub Africa. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>

  `;
}

module.exports = generateVerificationEmail;