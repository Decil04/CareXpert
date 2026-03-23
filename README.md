# CareXpert 🏥

CareXpert is a comprehensive health-focused mobile application designed to empower users with AI-driven medical report analysis and health management tools.

## 🚀 Overview

CareXpert leverages advanced AI (using Anthropic and Google Generative AI) to process and analyze medical documents, providing users with clear insights into their health data. The application features a premium UI/UX built with React Native and a robust backend powered by Node.js and MongoDB.

## ✨ Key Features

- **AI Medical Analysis**: Upload medical reports (PDF/Images) and get instant AI-powered insights.
- **Health History**: Securely store and manage your medical records.
- **Secure Authentication**: User sign-up and login with modern security practices.
- **Premium UI**: Sleek, modern interface with interactive elements and smooth transitions.
- **Real-time Updates**: Real-time communication and synchronized health data.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Language**: TypeScript
- **Styling**: Native styling with custom design tokens
- **Icons**: Lucide React Native
- **Navigation**: React Navigation

### Backend
- **Framework**: Node.js with [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose
- **AI Integration**: Anthropic SDK & Google Generative AI
- **Processing**: OCR (Tesseract.js) and PDF Parsing (pdf-parse)
- **Security**: JWT, BcryptJS, Helmet, Rate Limiting

## 📦 Project Structure

```text
CareXpert/
├── server/             # Node.js Backend
│   ├── src/            # Source code
│   └── package.json    # Backend dependencies
├── src/                # React Native Source
│   ├── screens/        # UI Screens
│   ├── navigation/     # App Routing
│   └── context/        # State Management
├── App.tsx             # App Entry Point
└── package.json        # Frontend dependencies
```

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app (for mobile testing)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a cloud instance)

### Installation & Setup

#### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add:
```env
PORT=3001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_google_ai_key
```

Run the backend:
```bash
npm run dev
```

#### 2. Frontend Setup

```bash
cd ..
npm install
```

Run the frontend:
```bash
npm run dev
```

## 📄 License

This project is licensed under the MIT License.
