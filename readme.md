# Abstracta Feedback

Abstracta Feedback is a customizable, private-label user feedback platform built with Next.js, Tailwind CSS, and Prisma.

## Features

- User authentication with Google Sign-In
- Feedback submission and listing
- Voting system for feedback items
- User profiles
- Admin dashboard for managing feedback and categories
- Private labeling support
- Responsive design with dark mode

## Prerequisites

- Node.js (v14 or later)
- MySQL database
- Google OAuth credentials

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/abstracta-feedback.git
   cd abstracta-feedback
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Copy the `.env.example` file to `.env.local` and fill in the required values:
   ```
   cp .env.example .env.local
   ```

4. Set up the database:
   ```
   npx prisma db push
   ```

5. Run the development server:
   ```
   npm run dev
   ```

## Configuration

### Private Labeling

To set up private labeling, edit the `config/privateLabel.js` file. Add new client configurations as needed.

### Authentication

This project uses NextAuth.js with Google authentication. Make sure to set up your Google OAuth credentials and update the `.env.local` file accordingly.

## Deployment

### General Deployment

1. Build the project:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

For deployment to platforms like Vercel or Netlify, refer to their respective documentation for Next.js deployments.

### Deploying to Dreamhost Shared Server

To deploy Abstracta Feedback to a Dreamhost shared server, follow these steps:

1. Ensure you have SSH access to your Dreamhost server.

2. Install Node.js on your Dreamhost server:
   - Log in to your server via SSH
   - Use the Dreamhost panel to install Node.js, or install it manually using NVM (Node Version Manager)

3. Set up a MySQL database for your application through the Dreamhost panel.

4. In your Dreamhost panel, create a new subdomain or use an existing domain for your application.

5. Connect to your Dreamhost server via SSH and navigate to the directory of your subdomain/domain.

6. Clone your repository:
   ```
   git clone https://github.com/yourusername/abstracta-feedback.git
   cd abstracta-feedback
   ```

7. Install dependencies:
   ```
   npm install
   ```

8. Create a `.env` file and add your environment variables, including the database connection string and other necessary configurations.

9. Build the application:
   ```
   npm run build
   ```

10. Set up a reverse proxy using Apache (Dreamhost uses Apache by default):
    - Create or edit the `.htaccess` file in your domain's root directory
    - Add the following rules:
      ```
      RewriteEngine On
      RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
      ```

11. Start your Node.js application using a process manager like PM2:
    ```
    npm install -g pm2
    pm2 start npm --name "abstracta-feedback" -- start
    ```

12. Ensure PM2 starts on server reboot:
    ```
    pm2 startup
    pm2 save
    ```

13. Your application should now be accessible through your Dreamhost domain/subdomain.

Remember to update your DNS settings if you're using a custom domain, and ensure your firewall settings allow traffic to your application's port.

Note: Dreamhost shared hosting has limitations. If you encounter issues or need more control, consider upgrading to a VPS or dedicated server.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
