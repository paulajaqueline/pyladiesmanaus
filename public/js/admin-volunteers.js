import { db } from './firebase.js';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

class AdminVolunteer {

  static async loadEvents() {
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      AdminVolunteer.renderEventCards(events);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
    }
  }

  static async toggleVisibility(eventId, currentVisibility) {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        visible: !currentVisibility
      });
      AdminVolunteer.loadEvents();
    } catch (err) {
      console.error('Erro ao atualizar visibilidade do evento:', err);
    }
  }

  static renderEventCards(events) {
    const eventList = document.getElementById('admin-event-list');
    eventList.innerHTML = '';

    events.forEach(event => {
      const dateObj = event.date.toDate
        ? event.date.toDate()
        : new Date(event.date);
      const formattedDate = dateObj.toLocaleDateString('pt-BR');

      const div = document.createElement('div');
      div.classList.add('event-card');
      div.setAttribute('data-id', event.id);
      div.innerHTML = `
        <h4>${event.title}</h4>
        <p>${event.description}</p>
        <p><strong>Data:</strong> ${formattedDate}</p>
      `;

      div.addEventListener('click', () => {
        AdminVolunteer.loadVolunteersByEvent(event.id);
      });

      const visibilityButton = document.createElement('button');
      visibilityButton.textContent = event.visible === false
        ? 'Reexibir evento'
        : 'Ocultar evento';
      visibilityButton.classList.add('visibility-button');

      visibilityButton.addEventListener('click', (e) => {
        e.stopPropagation();
        AdminVolunteer.toggleVisibility(event.id, event.visible);
      });

      div.appendChild(visibilityButton);
      eventList.appendChild(div);
    });
  }

  static async loadVolunteersByEvent(eventId) {
    const list = document.getElementById('volunteer-list');
    list.innerHTML = '';

    try {
      const q = query(collection(db, 'volunteers'), where("eventId", "==", eventId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        list.innerHTML = '<p>Nenhuma voluntária cadastrada para este evento.</p>';
        return;
      }

      snapshot.forEach(doc => {
        const v = doc.data();
        const card = document.createElement('div');
        card.classList.add('volunteer-card');
        card.innerHTML = `
          <p><strong>Nome:</strong> ${v.name}</p>
          <p><strong>E-mail:</strong> ${v.email}</p>
          <p><strong>Telefone:</strong> ${v.phone}</p>
        `;
        list.appendChild(card);
      });

    } catch (err) {
      console.error('Erro ao carregar voluntárias:', err);
    }
  }

  static async handleEventForm(e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const dateInput = document.getElementById('date').value;
    const date = new Date(dateInput + "T12:00:00");

    try {
      await addDoc(collection(db, 'events'), {
        title,
        description,
        date,
        visible: true,
        createdAt: serverTimestamp()
      });

      alert('Evento criado com sucesso!');
      document.getElementById('event-form').reset();
      document.getElementById('volunteer-list').innerHTML = '';
      AdminVolunteer.loadEvents();

    } catch (err) {
      console.error('Erro ao criar evento:', err);
      alert('Erro ao criar evento.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('[AdminVolunteer] DOM carregado.');
  AdminVolunteer.loadEvents();
  document.getElementById('event-form').addEventListener('submit', AdminVolunteer.handleEventForm);
});
