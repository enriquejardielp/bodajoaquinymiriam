class WeddingApp {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('HTTP error');
      const data = await response.json();
      this.setupApp(data);
    } catch (error) {
      console.error('Usando datos de respaldo:', error);
      this.setupApp(this.getBackupData());
    }
  }

  getBackupData() {
    return {
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
  }

  setupApp(data) {
    this.loadTexts(data);
    this.loadImages(data);
    this.setupMaps(data);
    this.setupScrollEffects();
    this.startCountdown(data.weddingDate);
  }

  loadTexts(data) {
    document.getElementById('main-title').textContent = data.texts.mainTitle;
    document.getElementById('invitation-text').textContent = data.texts.invitationText;
    document.getElementById('rsvp-link').textContent = data.texts.rsvpText;
    document.getElementById('church-title').textContent = data.locations.church.title;
    document.getElementById('church-time').textContent = data.locations.church.time;
    document.getElementById('restaurant-title').textContent = data.locations.restaurant.title;
    document.getElementById('restaurant-time').textContent = data.locations.restaurant.time;
  }

  loadImages(data) {
    this.setBackground('photo-container', data.images.mainPhoto);
    this.setBackground('church-image', data.images.churchPhoto);
    this.setBackground('restaurant-image', data.images.restaurantPhoto);
  }

  setBackground(elementId, imageUrl) {
    const img = new Image();
    img.onload = () => {
      document.getElementById(elementId).style.backgroundImage = `url('${imageUrl}')`;
    };
    img.onerror = () => {
      console.error(`Error cargando imagen: ${imageUrl}`);
      document.getElementById(elementId).style.backgroundColor = '#f5f0e6';
    };
    img.src = imageUrl;
  }

  setupMaps(data) {
    document.getElementById('church-map').innerHTML = `
      <iframe src="${data.locations.church.mapUrl}"
              loading="lazy"
              style="border:0;"
              allowfullscreen></iframe>`;

    document.getElementById('restaurant-map').innerHTML = `
      <iframe src="${data.locations.restaurant.mapUrl}"
              loading="lazy"
              style="border:0;"
              allowfullscreen></iframe>`;
  }

  setupScrollEffects() {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Efecto de opacidad
      document.getElementById('photo-container').style.opacity = 1 - Math.min(scrollY / (windowHeight * 0.7), 0.9);

      // Animaciones de secciones
      const sections = [
        { id: '.announcement', trigger: 0.2 },
        { id: '.countdown', trigger: 0.4 },
        { id: '.rsvp', trigger: 0.6 },
        { id: '#church-section', trigger: 1.2 },
        { id: '#restaurant-section', trigger: 2.2 }
      ];

      sections.forEach(({id, trigger}) => {
        const element = document.querySelector(id);
        if (scrollY > windowHeight * trigger) {
          element.classList.add('show');
        } else if (trigger > 1) {
          element.classList.remove('show');
        }
      });
    });
  }

  startCountdown(weddingDate) {
    const update = () => {
      const target = new Date(weddingDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(this.countdownInterval);
        document.getElementById('countdown-timer').innerHTML = '<div>¡Hoy es el día!</div>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

      document.getElementById('days').textContent = days;
      document.getElementById('hours').textContent = hours;
      document.getElementById('minutes').textContent = minutes;
      document.getElementById('seconds').textContent = seconds;
    };

    update();
    this.countdownInterval = setInterval(update, 1000);
  }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => new WeddingApp());