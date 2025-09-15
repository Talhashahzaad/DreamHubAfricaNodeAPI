module.exports = function generateResetSuccessPage() {
  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Changed Successfully</title>
</head>
<body style="margin:0;  padding:0; background-color:#f6f6f6; font-family: Arial, sans-serif;">

  <!-- Wrapper -->
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding:30px 0; ">
    <tr>
      <td align="center">
        
        <!-- Card -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px; background-color:#D9A928; border-radius:8px; padding:40px 30px;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img src="${process.env.FRONTEND_URL}/public/assets/logo/518x360.png" alt="DreamHub Africa" width="160" style="display:block; max-width:160px;">
            </td>
          </tr>

          <!-- Success Icon -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img src="${process.env.FRONTEND_URL}/public/assets/default/tick-mark.png" alt="Success" width="70" style="display:block;">
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="font-size:22px; font-weight:bold; color:#1B4D2B; padding-bottom:10px;">
              Password Changed Successfully
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td align="center" style="font-size:15px; color:#555; line-height:1.6; padding-bottom:30px;">
              Your password has been updated successfully.<br>
              You can now log in to your account using your new password.
            </td>
          </tr>

        </table>
        <!-- End Card -->

      </td>
    </tr>
    <tr>
            <td align="center" style="color:#000; font-size:12px; padding:12px 0;">
              © ${new Date().getFullYear()} DreamHub Africa. All rights reserved.
            </td>
          </tr>
  </table>

</body>
</html>



  `;
};
