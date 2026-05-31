# Sahaya Mail Analyser

A privacy-first React + Firebase email analysis app with Gmail sign-in, AI-powered insights, and local configuration.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` or `.env`
3. Set the required environment variables in your local env file
4. Run the app:
   `npm run dev`

## Environment Variables

Use `.env.example` as a template and provide values for:

- `GEMINI_API_KEY`
- `APP_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Build

- `npm run build`
- `npm start`

## Validation

- `npm run lint`
