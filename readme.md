# Show Tap Bot Backend

This repository contains the backend server for the Show Tap Bot, which serves as a platform for user interactions via a Telegram bot. The backend is designed to facilitate communication and manage user data efficiently.


## Technology Stack

- **Node.js**
- **GraphQL Yoga**
- **Supabase**
- **TypeScript**
- **Telegram Bot API**

## Getting Started

### Installation Steps

1. Clone the repository:

```bash
   git clone https://github.com/jeevannn0/IShowTap_Sever.git
```

2. Install dependencies:

```bash
npm install
```

### Configuration

1. environment variables:

```bash
BOT_TOKEN=your-telegram-bot-token
SUPABASE_URL=your-supabase-url
SUPABASE_API_KEY=your-supabase-api-key
```

Replace your-telegram-bot-token, your-supabase-url, and your-supabase-api-key with your actual credentials.

2. schemas:

- `User_id`
- `name`
- `coin_id`

### Running Local

1. Start the server:

```bash
npm start
```

2. The server will be running on http://localhost:4000.

>

## How It Works

1. **Telegram Bot:** Listens for /start commands and interacts with users. It sends a welcome message and a button to open the TapMe game if the user does not exist in the database or a welcome back message if they do.
2. **GraphQL Server:** Handles GraphQL queries and mutations to fetch and update user data. The server communicates with Supabase to retrieve and modify data.
3. **Supabase:** Manages user data and coin balances.


