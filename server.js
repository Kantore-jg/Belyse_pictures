import { createServer } from 'vite';

const PORT = 5173;

async function startServer() {
  const vite = await createServer({
    server: {
      port: PORT,
      host: '0.0.0.0',
    },
  });

  await vite.listen();
  console.log(`Server running on http://localhost:${PORT}`);
}

startServer();
