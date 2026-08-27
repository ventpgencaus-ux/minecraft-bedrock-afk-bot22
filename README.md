# Minecraft Bedrock AFK / Keep-Alive Bot

Joins your Bedrock server as a normal player and jumps every few seconds so
the server always has at least one "player" connected. Useful for hosts
(like Aternos and similar free hosts) that automatically shut a server down
after it sits empty for a while.

This version is set up for **offline mode** servers (no Xbox Live login
required), matching what you told me about your server.

## Requirements
- Node.js 18+ installed (https://nodejs.org)
- Your server must allow the Bedrock port (default `19132`, UDP) through
  from outside — same port you'd use to connect from the Bedrock client.

## Setup

```bash
cd minecraft-bedrock-afk-bot
npm install
cp .env.example .env
```

Edit `.env`:
```
SERVER_HOST=your.server.ip.or.domain
SERVER_PORT=19132
BOT_USERNAME=AFK_Bot
```

Then run it:
```bash
npm start
```

You should see:
```
Connecting to your.server.ip.or.domain:19132 as "AFK_Bot"...
✅ Bot has spawned in the world. Starting keep-alive jumps...
```

## Running it 24/7
This script needs to keep running somewhere for it to help — your own
computer, a small VPS, or the same hosting/domain setup you already have.
If you want it running continuously in the background, tools like `pm2`
(Node process manager) or a systemd service both work well:

```bash
npm install -g pm2
pm2 start bot.js --name afk-bot
pm2 save
```

## Notes / troubleshooting
- If the bot gets kicked immediately, check that:
  - Your server actually has "online-mode"/Xbox auth turned OFF (matches
    the offline setup this bot uses).
  - The `SERVER_HOST`/`SERVER_PORT` are correct and reachable from wherever
    you're running the bot.
- If your server ends up requiring Xbox Live login later, let me know — the
  setup is different (it needs a one-time device-code sign-in) and I can
  put together that version instead.
- Bedrock protocol packet names occasionally change between Minecraft
  versions. If the jump action stops working after a game update, check
  https://github.com/PrismarineJS/bedrock-protocol for the current example
  usage — the connection/reconnect logic in this bot will still work either
  way.
- Some servers (and some hosting Terms of Service) don't allow AFK/bot
  players — worth double-checking your host's rules so this doesn't get
  your server flagged.
