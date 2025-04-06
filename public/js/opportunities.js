import { db } from './firebase.js';
import {
  collection,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  loadOpportunities();
});

async function loadOpportunities() {
  try {
    const q = query(collection(db, 'opportunities'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const container = document.getElementById('opportunities-list');

    snapshot.forEach(doc => {
      const data = doc.data();

      const card = document.createElement('div');
      card.classList.add('opportunity-card');
      card.addEventListener('click', () => {
        if (data.link) window.open(data.link, '_blank');
      });

      const img = document.createElement('img');
      img.src = data.image || '../img/default-opportunity.png';
      img.alt = 'Imagem da oportunidade';

      const info = document.createElement('div');
      info.classList.add('opportunity-info');

      const expiration = data.expiration?.toDate
        ? data.expiration.toDate().toLocaleDateString('pt-BR')
        : 'Sem data definida';

      card.innerHTML = `
        <img src="${data.image || '../img/default-opportunity.png'}" alt="Imagem da oportunidade" class="opportunity-img">
        <div class="opportunity-info">
          <h4>${data.title}</h4>
          <p><strong>Empresa:</strong> ${data.company}</p>
          <p><strong>Tipo:</strong> ${data.type}</p>
          <p><strong>Forma de trabalho:</strong> ${data.workMode}</p>
          <p><strong>Localidade:</strong> ${data.location || 'Não informado'}</p>
          <p class="prerequisites"><strong>Pré-requisitos:<br></strong> ${data.prerequisites || 'Não informado'}</p>
          <p><strong>Válido até:</strong> ${data.expiration?.toDate ? data.expiration.toDate().toLocaleDateString('pt-BR') : 'Sem data'}</p>
          <a href="${data.link}" class="apply-button" target="_blank">Candidatar-se</a>
        </div>
      `;

      card.appendChild(info);
      container.appendChild(card);
    });

  } catch (err) {
    console.error('Erro ao carregar oportunidades:', err);
  }
}
