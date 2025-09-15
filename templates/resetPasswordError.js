module.exports = function generateResetErrorPage(message) {
  return `
  <html>
    <head>
      <title>Password Reset Failed</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f9fafb; text-align: center; padding: 50px; }
        .card { background: white; padding: 30px; border-radius: 12px; max-width: 500px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h2 { color: #dc2626; }
        footer{
    margin-top:50px;
    }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Password Reset Failed</h2>
        <p>${message || "The reset link is invalid or has expired."}</p>
      </div>

      <footer>
    &copy; 2025 DreamHub Africa. All rights reserved. <br />
  </footer>
    </body>
  </html>
  `;
};
