import { db } from './firebase.js';
import {
  collection,
  getDocs,
  addDoc,
  orderBy,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

class VolunteerForm {
  static async loadEvents() {
    try {
      const q = query(
        collection(db, 'events'),
        where('visible', '==', true)
      );
      const snapshot = await getDocs(q);

      const events = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => {
          const dateA = a.date.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date.toDate ? b.date.toDate() : new Date(b.date);
          return dateA - dateB;
        });

      VolunteerForm.renderEvents(events);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
    }
  }

  static renderEvents(events) {
    const eventSelect = document.getElementById('event');
    const eventContainer = document.getElementById('event-info');

    eventSelect.innerHTML = '<option value="">Selecione um evento</option>';
    eventContainer.innerHTML = '';

    events.forEach(event => {
      const option = document.createElement('option');
      option.value = event.id;
      option.textContent = event.title;
      eventSelect.appendChild(option);

      const div = document.createElement('div');
      div.classList.add('event-card');

      const date = event.date.toDate
        ? event.date.toDate().toLocaleDateString('pt-BR')
        : event.date;

      div.innerHTML = `
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <p><strong>Data:</strong> ${date}</p>
      `;
      eventContainer.appendChild(div);
    });
  }

  static formatPhone(phone) {
    return phone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '+55 $1 $2-$3');
  }

  static async handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneRaw = document.getElementById('phone').value.trim();
    const eventId = document.getElementById('event').value;

    if (!eventId) return alert('Por favor, selecione um evento.');

    const phone = VolunteerForm.formatPhone(phoneRaw);

    try {
      await addDoc(collection(db, 'volunteers'), {
        name,
        email,
        phone,
        eventId,
        createdAt: serverTimestamp()
      });

      alert('Inscrição enviada com sucesso!');
      document.getElementById('volunteer-form').reset();
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar inscrição.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('[VolunteerForm] DOM carregado.');
  VolunteerForm.loadEvents();
  document.getElementById('volunteer-form').addEventListener('submit', VolunteerForm.handleSubmit);
});
