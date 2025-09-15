module.exports = function generateResetPasswordEmail(resetURL, logoURL) {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Password - DreamHub Africa</title>
</head>
<body style="margin:0; padding:0; background-color:#D9A928; font-family: Arial, sans-serif;">

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#D9A928; padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="420" border="0" cellspacing="0" cellpadding="0" 
               style="background-color:#F5E6A8; border-radius:12px; padding:30px; text-align:center;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img src="${process.env.FRONTEND_URL}/public/assets/logo/logo-dreamhub.png" alt="DreamHub Africa Logo" width="60" style="display:block;">
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="font-size:20px; font-weight:bold; color:#124B1E; padding-bottom:5px;">
              Reset Your Password
            </td>
          </tr>

          <!-- Subtext -->
          <tr>
            <td align="center" style="font-size:14px; color:#333; padding-bottom:20px;">
              If you’ve lost your password or wish to reset it, click below.
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center">
              <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin:auto;">
                <tr>
                  <td align="center" bgcolor="#124B1E" style="border-radius:8px;">
                    <a href="${resetURL}" 
                       style="display:inline-block; padding:12px 24px; font-size:15px; font-weight:bold; 
                              color:#ffffff; text-decoration:none; font-family:Arial, sans-serif;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- End Container -->
        <tr>
            <td align="center" style="color:#000; font-size:12px; padding:12px 0;">
              © ${new Date().getFullYear()} DreamHub Africa. All rights reserved.
            </td>
          </tr>

      </td>
    </tr>
  </table>

</body>
</html>

  `;
};
