# Curiocity Horizon

Horizon Feedback is a customizable, private-label user feedback platform built with Next.js, Tailwind CSS, and Firebase.

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
- Firebase account
- Google OAuth credentials

## Installation

1. Clone the repository:
   ```
   gh repo clone Curiocity-Experiments/horizon
   cd horizon
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore and Authentication (with Google provider) in your Firebase project
   - Generate a new private key for your service account in Project Settings > Service Accounts
   - Save the private key as `firebase-admin-key.json` in the root of your project

4. Set up environment variables:
   Copy the `.env.example` file to `.env.local` and fill in the required values:
   ```
   cp .env.example .env.local
   ```
   Update the Firebase configuration variables in `.env.local` with your Firebase project details.

5. Run the development server:
   ```
   npm run dev
   ```

## Configuration

### Private Labeling

To set up private labeling, edit the `config/privateLabel.js` file. Add new client configurations as needed.

### Authentication

This project uses Firebase Authentication with Google sign-in. Make sure to set up your Google OAuth credentials in the Firebase Console and update the `.env.local` file accordingly.

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

For deployment to platforms like Vercel or Netlify, refer to their respective documentation for Next.js deployments and ensure you set up the necessary environment variables.

### Deploying to Firebase Hosting

1. Install the Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize your project:
   ```
   firebase init
   ```
   Select Hosting and any other Firebase services you want to use.

4. Build your Next.js app:
   ```
   npm run build
   ```

5. Deploy to Firebase:
   ```
   firebase deploy
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.