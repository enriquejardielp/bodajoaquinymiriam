document.addEventListener('DOMContentLoaded', () => {
  // Datos de respaldo
  const backupData = {
    weddingDate: "September 13, 2025 12:00:00 GMT+0200",
    images: {
      mainPhoto: "/assets/fotoboda.JPEG",
      churchPhoto: "/assets/fotoiglesia.JPEG",
      restaurantPhoto: "/assets/fotorestaurante.JPEG"
    },
    texts: {
      rsvpLink: "https://forms.google.com/tu-formulario"
    }
  };

  // Cargar datos
  fetch('/data.json')
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => initApp(data))
    .catch(() => initApp(backupData));

  function initApp(data) {
    // 1. Configurar DOM
    const setText = (id, text) => document.getElementById(id).textContent = text;
    
    setText('main-title', data.texts.mainTitle);
    setText('invitation-text', data.texts.invitationText);
    setText('church-title', data.locations.church.title);
    setText('church-time', data.locations.church.time);
    setText('restaurant-title', data.locations.restaurant.title);
    setText('restaurant-time', data.locations.restaurant.time);
    
    // 2. Botón RSVP
    const rsvpBtn = document.getElementById('rsvp-link');
    rsvpBtn.textContent = data.texts.rsvpText;
    rsvpBtn.href = data.texts.rsvpLink || "#";

    // 3. Cargar imágenes
    const loadImg = (id, src) => {
      const img = new Image();
      img.onload = () => {
        document.getElementById(id).style.backgroundImage = `url('${src}')`;
      };
      img.onerror = () => console.error('Error cargando:', src);
      img.src = src;
    };

    loadImg('photo-container', data.images.mainPhoto);
    loadImg('church-image', data.images.churchPhoto);
    loadImg('restaurant-image', data.images.restaurantPhoto);

    // 4. Efecto scroll
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Desvanecimiento
      document.getElementById('photo-container').style.opacity = 1 - Math.min(scrollY / (windowHeight * 0.7), 0.9);

      // Mostrar elementos
      document.querySelectorAll('.announcement, .countdown, .rsvp').forEach(el => {
        el.classList.toggle('show', scrollY > windowHeight * 0.3);
      });
    });

    // 5. Cuenta regresiva
    const updateTimer = () => {
      const diff = new Date(data.weddingDate) - new Date();
      
      if (diff <= 0) {
        document.getElementById('countdown-timer').innerHTML = '<div>¡Hoy es el día!</div>';
        return;
      }

      document.getElementById('days').textContent = Math.floor(diff / 86400000).toString().padStart(2, '0');
      document.getElementById('hours').textContent = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0');
      document.getElementById('minutes').textContent = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      document.getElementById('seconds').textContent = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    };

    setInterval(updateTimer, 1000);
    updateTimer();
  }
});