# Astra - Your AI Personality Universe

Astra is a web application built with Next.js that allows users to explore and interact with a diverse collection of AI personalities. Engage in unique conversations, switch between text and voice modes, and experience the distinct character of each AI.

## Features

*   **Diverse AI Personalities:** Chat with pre-defined AI characters like Astra (helpful assistant), Muse (creative poet), Modiji (visionary leader persona), Krishna (wise guide), Luna (philosophical thinker), Gabbar (mischievous villain), and more. Each AI has a unique system prompt defining its behavior.
*   **User Authentication:** Secure registration and login system for personalized experiences.
*   **Persistent Chat History:** Conversations are saved per user and per AI personality, allowing you to continue where you left off.
*   **Text-Based Chat:** Engage with AI personalities through a standard chat interface.
*   **(Potential) Voice Mode:** Functionality for voice-based interactions appears to be included (needs verification based on `VoiceMode` directory).
*   **(Planned) Custom AI Creation:** A feature to design and create your own AI personalities is planned for the future.

## Tech Stack

*   **Frontend:** Next.js, React
*   **Backend:** Node.js (via Next.js API Routes)
*   **Database:** MongoDB with Mongoose ODM
*   **AI:** OpenAI API (`gpt-4o-mini`)
*   **Authentication:** bcryptjs (for password hashing)
*   **Styling:** CSS Modules
*   **(Other):** Groq SDK (Usage details not fully determined from snippets)

## Project Structure

```
/
├── public/           # Static assets
├── src/
│   ├── app/          # Next.js App Router
│   │   ├── api/      # Backend API routes (auth, chat, etc.)
│   │   │   ├── auth/      # Authentication endpoints (login, register)
│   │   │   ├── chat/      # Chat handling API
│   │   │   ├── lib/       # Shared libraries (e.g., MongoDB connection)
│   │   │   └── models/    # Mongoose data models (e.g., User)
│   │   ├── components/ # Reusable React components
│   │   ├── context/    # React context (e.g., for auth state)
│   │   ├── AstraVerse/ # Main personality selection and interaction page/component
│   │   ├── chat/       # Chat interface page
│   │   ├── login/      # Login page
│   │   ├── register/   # Registration page
│   │   ├── VoiceMode/  # Components/logic related to voice interaction
│   │   ├── layout.js   # Root layout
│   │   └── page.js     # Main application entry page (landing/auth check)
│   └── ...
├── .env              # Environment variables (local, gitignored)
├── next.config.mjs   # Next.js configuration
├── package.json      # Project dependencies and scripts
└── README.md         # This file
```

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm, yarn, or pnpm
*   MongoDB instance (local or cloud-based like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd astra
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### Environment Variables

Create a `.env` file in the root of the project and add the following environment variables. Obtain the necessary API keys and connection strings.

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key

# (Potentially Required - Add if used for JWT or sessions)
# JWT_SECRET=your_strong_jwt_secret

# (Potentially Required - Add if Groq SDK is actively used)
# GROQ_API_KEY=your_groq_api_key
```

Replace the placeholder values with your actual credentials.

### Running the Development Server

Start the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

To create a production build:

```bash
npm run build
```

To run the production build:

```bash
npm run start
```

## API Endpoints

The application uses Next.js API routes located in `src/app/api/`. Key endpoints include:

*   `POST /api/auth/register`: User registration.
*   `POST /api/auth/login`: User login.
*   `POST /api/chat`: Handles sending user messages to the selected AI personality and receiving responses via the OpenAI API.
