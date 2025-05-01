const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración avanzada
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html', 'css', 'js'],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// API endpoint para los datos
app.get('/api/data', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'data.json'), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=3600'
    }
  });
});

// Single Page Application Handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store'
    }
  });
});

// Manejo de errores profesional
app.use((err, req, res, next) => {
  console.error(`💥 Error: ${err.stack}`);
  res.status(500).sendFile(path.join(__dirname, 'public', 'error.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});