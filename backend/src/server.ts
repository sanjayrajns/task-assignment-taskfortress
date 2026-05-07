import createApp from './app';
import { connectDatabase } from './database/connection';
import { env } from './config/env.config';

const bootstrap = async (): Promise<void> => {
  // Connect to MongoDB before binding the HTTP server
  await connectDatabase();

  const app = createApp();

  const server = app.listen(env.port, () => {
    console.log(`\n🚀 Server running in ${env.nodeEnv} mode`);
    console.log(`   ➜  Local:   http://localhost:${env.port}`);
    console.log(`   ➜  Health:  http://localhost:${env.port}/health`);
    console.log(`   ➜  API:     http://localhost:${env.port}/api/v1\n`);
  });

  // ─── Graceful shutdown ───────────────────────────────────────────────────────
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });

    // Force shutdown if graceful close takes too long
    setTimeout(() => {
      console.error('⚠️  Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle unhandled promise rejections — log and exit
  process.on('unhandledRejection', (reason: unknown) => {
    console.error('💥 Unhandled Promise Rejection:', reason);
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions — log and exit (process is in undefined state)
  process.on('uncaughtException', (error: Error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
  });
};

bootstrap();
