import { Server } from 'http';
import app from './app';
import config from './config';

let server: Server;

async function main() {
  try {
    server = app.listen(config.port, () => {
      console.log(`RentNest server is listening on port ${config.port} 🚀`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

main();

process.on('unhandledRejection', (err) => {
  console.log(`😈 unhandledRejection is detected, shutting down...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.log(`😈 uncaughtException is detected, shutting down...`, err);
  process.exit(1);
});