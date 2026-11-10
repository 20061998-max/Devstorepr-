import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

// Serve static assets from Vite dist folder
app.use(express.static(distPath));

// Client-side fallback for SPA
app.get('*', (_req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('<h1>Aguardando build... Por favor configure Build Command como npm run build</h1>');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`DevStore rodando com sucesso na porta ${port}`);
});
