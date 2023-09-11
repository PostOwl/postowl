import { server as app } from '/app/build/index.js';

function shutdownServer() {
  console.log('Server doing graceful shutdown');
  app.server.close();
}

// Shutdown gracefully when fly machine auto stops
process.on('SIGINT', shutdownServer);
process.on('SIGTERM', shutdownServer);
