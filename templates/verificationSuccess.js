  // Success page 

 function generateSuccessPage() {
   return `
   <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email verification success</title>
  <style>
    /* Page background */
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #D9A928;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }

    /* Logo */
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo img {
      max-width: 220px;
      height: auto;
    }

    .success{
      width:80px;
    }
    /* Card */
    .card {
      background-color: #FCEEA9;
      border-radius: 12px;
      padding: 40px 30px;
      text-align: center;
      width: 500px;
      max-width: 90%;
      box-sizing: border-box;
    }

    /* Success Icon */
    .icon {
      font-size: 60px;
      color: #22c55e; /* green check */
      margin-bottom: 20px;
    }

    /* Heading */
    .card h2 {
      font-size: 22px;
      margin: 0 0 10px;
      color: #1B4D2B;
    }

    /* Paragraph */
    .card p {
      font-size: 14px;
      margin: 0;
      color: #333;
    }

    footer{
    margin-top:50px;
    }


    /* Responsive tweaks */
    @media (max-width: 480px) {
      .card {
        padding: 30px 20px;
      }
      .card h2 {
        font-size: 18px;
      }
      .card p {
        font-size: 13px;
      }
      .icon {
        font-size: 50px;
      }
    }
  </style>
</head>
<body>

  <!-- Logo -->
  <div class="logo">
    <img src="${process.env.FRONTEND_URL}/public/assets/logo/518x360.png" alt="DreamHub Africa" />
  </div>

  <!-- Card -->
  <div class="card">
    <img class="success" src="${process.env.FRONTEND_URL}/public/assets/default/Group.png" alt="">
    <h2>Email Verified!</h2>
    <p>Your email has been successfully verified. You can now login to your account</p>
  </div>

  <footer>
    &copy; 2025 DreamHub Africa. All rights reserved. <br />
  </footer>


</body>
</html>
   `;
 }

 module.exports = generateSuccessPage; 





