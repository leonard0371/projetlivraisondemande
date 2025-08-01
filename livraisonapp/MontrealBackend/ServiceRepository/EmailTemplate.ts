export const generateEmailTemplate = ( companyName: string, text: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dddddd;
          }
          h1 {
            color: #333333;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
            color: #666666;
          }
          .footer {
            font-size: 12px;
            color: #999999;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h1>Welcome to ${companyName}!</h1>
          <p>Hi </p>
          <p>${text}</p>
          <p>Best regards,<br>${companyName}</p>

          <div class="footer">
            <p>&copy; 2024 ${companyName}. All rights reserved.</p>
            <p><a href="https://montrealhaven.com">Visit Site</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
};
