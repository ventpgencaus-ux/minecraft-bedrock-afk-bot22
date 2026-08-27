// ============================================================
// Minecraft Bedrock AFK / Keep-Alive Bot
// ------------------------------------------------------------
// Connects to your Bedrock server as a normal player, then
// jumps every few seconds so the server always sees at least
// 1 player online. Many free hosts (e.g. Aternos) auto-shut-down
// a server when it's empty for a while — this stops that.
//
// Built with "bedrock-protocol" (offline mode, no Xbox login).
// ============================================================

require('dotenv').config();
const bedrock = require('bedrock-protocol');

const HOST = process.env.SERVER_HOST || 'localhost';
const PORT = parseInt(process.env.SERVER_PORT || '19132', 10);
const USERNAME = process.env.BOT_USERNAME || 'AFK_Bot';
const JUMP_INTERVAL_MS = parseInt(process.env.JUMP_INTERVAL_MS || '15000', 10);
const RECONNECT_DELAY_MS = parseInt(process.env.RECONNECT_DELAY_MS || '10000', 10);

let jumpTimer = null;

function connect() {
  console.log(`Connecting to ${HOST}:${PORT} as "${USERNAME}"...`);

  const client = bedrock.createClient({
    host: HOST,
    port: PORT,
    username: USERNAME,
    offline: true, // no Xbox Live login needed
  });

  client.on('spawn', () => {
    console.log('✅ Bot has spawned in the world. Starting keep-alive jumps...');

    jumpTimer = setInterval(() => {
      try {
        client.queue('player_action', {
          runtime_entity_id: client.entityId,
          action: 'jump',
          position: { x: 0, y: 0, z: 0 },
          face: 0,
        });
      } catch (err) {
        console.error('Failed to send jump action:', err.message);
      }
    }, JUMP_INTERVAL_MS);
  });

  client.on('disconnect', (packet) => {
    console.log('❌ Disconnected from server:', packet && packet.reason);
    cleanupAndReconnect();
  });

  client.on('kick', (packet) => {
    console.log('❌ Kicked from server:', packet);
    cleanupAndReconnect();
  });

  client.on('close', () => {
    console.log('Connection closed.');
    cleanupAndReconnect();
  });

  client.on('error', (err) => {
    console.error('⚠️ Client error:', err.message);
  });

  function cleanupAndReconnect() {
    if (jumpTimer) {
      clearInterval(jumpTimer);
      jumpTimer = null;
    }
    console.log(`Reconnecting in ${RECONNECT_DELAY_MS / 1000}s...`);
    setTimeout(connect, RECONNECT_DELAY_MS);
  }
}

connect();
