document.addEventListener('DOMContentLoaded', function() {
  // Datos de respaldo (fallback)
  const backupData = {
    weddingDate: "September 13, 2025 12:00:00 GMT+0200",
    images: {
      mainPhoto: "/assets/fotoboda.JPEG",
      churchPhoto: "/assets/fotoiglesia.JPEG",
      restaurantPhoto: "/assets/fotorestaurante.JPEG"
    },
    locations: {
      church: {
        title: "NOS CASAMOS AQUÍ",
        time: "13 de Septiembre 2025 · 12:00",
        mapUrl: "https://maps.google.com/maps?q=https://maps.app.goo.gl/kRf2xXYvWMr4b6bs7&output=embed"
      },
      restaurant: {
        title: "CELEBRACIÓN",
        time: "Restaurante · 14:30",
        mapUrl: "https://maps.google.com/maps?q=https://maps.app.goo.gl/MZmUCn91GQZxh1TG7&output=embed"
      }
    },
    texts: {
      mainTitle: "Nos Casamos",
      invitationText: "Con gran alegría queremos compartir este momento especial con ustedes",
      rsvpText: "Confirmar Asistencia"
    }
  };

  // Cargar datos JSON
  fetch('/data.json')
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar datos');
      return response.json();
    })
    .then(data => initializeApp(data))
    .catch(error => {
      console.error('Error:', error);
      initializeApp(backupData);
    });

  function initializeApp(data) {
    // 1. Configurar elementos del DOM
    const dom = {
      photoContainer: document.getElementById('photo-container'),
      mainTitle: document.getElementById('main-title'),
      invitationText: document.getElementById('invitation-text'),
      rsvpLink: document.getElementById('rsvp-link'),
      churchTitle: document.getElementById('church-title'),
      churchTime: document.getElementById('church-time'),
      restaurantTitle: document.getElementById('restaurant-title'),
      restaurantTime: document.getElementById('restaurant-time'),
      days: document.getElementById('days'),
      hours: document.getElementById('hours'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds'),
      churchMap: document.getElementById('church-map'),
      restaurantMap: document.getElementById('restaurant-map'),
      churchImage: document.getElementById('church-image'),
      restaurantImage: document.getElementById('restaurant-image')
    };

    // 2. Aplicar textos
    dom.mainTitle.textContent = data.texts.mainTitle;
    dom.invitationText.textContent = data.texts.invitationText;
    dom.rsvpLink.textContent = data.texts.rsvpText;
    dom.churchTitle.textContent = data.locations.church.title;
    dom.churchTime.textContent = data.locations.church.time;
    dom.restaurantTitle.textContent = data.locations.restaurant.title;
    dom.restaurantTime.textContent = data.locations.restaurant.time;

    // 3. Cargar imágenes
    const loadImage = (element, src) => {
      const img = new Image();
      img.onload = () => element.style.backgroundImage = `url('${src}')`;
      img.onerror = () => console.error(`Error cargando: ${src}`);
      img.src = src;
    };

    loadImage(dom.photoContainer, data.images.mainPhoto);
    loadImage(dom.churchImage, data.images.churchPhoto);
    loadImage(dom.restaurantImage, data.images.restaurantPhoto);

    // 4. Configurar mapas
    dom.churchMap.innerHTML = `
      <iframe src="${data.locations.church.mapUrl}"
              loading="lazy"
              style="border:0;"
              allowfullscreen></iframe>`;

    dom.restaurantMap.innerHTML = `
      <iframe src="${data.locations.restaurant.mapUrl}"
              loading="lazy"
              style="border:0;"
              allowfullscreen></iframe>`;

    // 5. Efectos de scroll
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Fondo principal
      dom.photoContainer.style.opacity = 1 - Math.min(scrollY / (windowHeight * 0.7), 0.9);

      // Mostrar elementos según scroll
      document.querySelectorAll('.announcement, .countdown, .rsvp, #church-section, #restaurant-section').forEach(el => {
        const trigger = {
          '.announcement': 0.2,
          '.countdown': 0.4,
          '.rsvp': 0.6,
          '#church-section': 1.2,
          '#restaurant-section': 2.2
        }[el.id || el.className];
        
        if (scrollY > windowHeight * trigger) {
          el.classList.add('show');
        } else if (trigger > 1) {
          el.classList.remove('show');
        }
      });
    });

    // 6. Cuenta regresiva
    function updateCountdown() {
      const target = new Date(data.weddingDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        document.getElementById('countdown-timer').innerHTML = '<div>¡Hoy es el día!</div>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      dom.days.textContent = days.toString().padStart(2, '0');
      dom.hours.textContent = hours.toString().padStart(2, '0');
      dom.minutes.textContent = minutes.toString().padStart(2, '0');
      dom.seconds.textContent = seconds.toString().padStart(2, '0');
    }

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
  }
});