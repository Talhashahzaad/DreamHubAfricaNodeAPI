// Already verified

function generateAlreadyVerifiedPage() {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email already verified</title>
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
      width:60px;
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

    footer{
    margin-top:50px;
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
    <img src="../public/assets/logo/518x360.png" alt="DreamHub Africa" />
  </div>

  <!-- Card -->
  <div class="card">
    <img class="success" src="${process.env.FRONTEND_URL}/public/assets/default/tick-mark.png" alt="">
    <h2>Email already verified</h2>
    <p>Your email is already verified. You can directly log into your account.</p>
  </div>

  <footer>
    &copy; 2025 DreamHub Africa. All rights reserved. <br />
  </footer> 

</body>
</html>
  `;
}


module.exports = generateAlreadyVerifiedPage;