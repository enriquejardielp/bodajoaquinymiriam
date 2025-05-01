const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración avanzada para Render
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
  }
});

// Endpoint para datos
app.get('/data.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'data.json'), {
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
});

// Single Page Application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.stack);
  res.status(500).send('Error en el servidor');
});

app.listen(PORT, () => {
  console.log(`✅ Servidor activo: http://localhost:${PORT}`);
});