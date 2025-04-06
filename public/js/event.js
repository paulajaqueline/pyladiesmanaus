import { db } from './firebase.js';
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

class EventViewer {
  static async loadEvents() {
    try {
      const snapshot = await getDocs(collection(db, 'events'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      return [];
    }
  }

  static async renderUpcoming(events) {
    const container = document.getElementById('upcoming-list');
    container.innerHTML = '';

    const now = new Date();
    const futureEvents = events.filter(e => {
      const d = e.date.toDate ? e.date.toDate() : new Date(e.date);
      return d >= now;
    });

    const grouped = {};
    futureEvents.forEach(e => {
      const d = e.date.toDate ? e.date.toDate() : new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(e);
    });

    Object.keys(grouped).sort().forEach(key => {
      const [year, month] = key.split('-');
      const groupTitle = document.createElement('h4');
      groupTitle.textContent = `${EventViewer.getMonthName(+month)} / ${year}`;
      container.appendChild(groupTitle);

      grouped[key].forEach(EventViewer.renderCardTo(container));
    });
  }

  static renderCardTo(container) {
    return event => {
      const d = event.date.toDate ? event.date.toDate() : new Date(event.date);
      const dateStr = d.toLocaleDateString('pt-BR');
      const card = document.createElement('div');
      card.classList.add('event-summary');

      card.innerHTML = `
        <img src="${event.image || 'https://via.placeholder.com/80'}" alt="Evento" class="event-thumb">
        <div class="event-info">
          <h5>${event.title}</h5>
          <p>${event.description}</p>
          <p><strong>Data:</strong> ${dateStr}</p>
          <button class="details-button" data-id="${event.id}">Ver detalhes</button>
        </div>
      `;

      card.querySelector('button').addEventListener('click', () => {
        EventViewer.openModal(event);
      });

      container.appendChild(card);
    };
  }

  static openModal(event) {
    const modal = document.getElementById('event-modal');
    const modalBody = document.getElementById('modal-body');
    const d = event.date.toDate ? event.date.toDate() : new Date(event.date);

    modalBody.innerHTML = `
      <h3>${event.title}</h3>
      <p><strong>Data:</strong> ${d.toLocaleDateString('pt-BR')}</p>
      <p>${event.description}</p>
      ${event.even3Link ? `<iframe src="${event.even3Link}" width="100%" height="500" frameborder="0"></iframe>` : ''}
      <br>
      <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${EventViewer.googleDate(d)}/${EventViewer.googleDate(d)}&details=${encodeURIComponent(event.description)}" target="_blank">+ Adicionar ao Google Agenda</a>
    `;

    modal.classList.remove('hidden');
  }

  static googleDate(date) {
    return date.toISOString().replace(/[-:]|\.\d{3}/g, '').slice(0, 15) + 'Z';
  }

  static getMonthName(monthIndex) {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return meses[monthIndex];
  }

  static async initCalendar() {
    const calendarEl = document.getElementById('calendar');
    const events = await EventViewer.loadEvents();

    const transformed = events.map(event => {
      const date = event.date.toDate ? event.date.toDate() : new Date(event.date);
      return {
        id: event.id,
        title: event.title,
        start: date,
        extendedProps: {
          description: event.description,
          even3Link: event.even3Link || '',
        }
      };
    });

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'pt-br',
      height: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      events: transformed,
      eventClick: function (info) {
        const event = info.event;
        EventViewer.openModal({
          id: event.id,
          title: event.title,
          description: event.extendedProps.description,
          even3Link: event.extendedProps.even3Link,
          date: event.start
        });
      }
    });

    calendar.render();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const events = await EventViewer.loadEvents();
  await EventViewer.renderUpcoming(events);
  await EventViewer.initCalendar();

  document.querySelector('.close-button').addEventListener('click', () => {
    document.getElementById('event-modal').classList.add('hidden');
  });
});
