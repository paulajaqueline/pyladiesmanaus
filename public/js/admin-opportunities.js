import { db } from './firebase.js';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.getElementById('upload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const preview = document.getElementById('preview');
    preview.src = reader.result;
    preview.style.display = 'block';
    document.getElementById('image').value = reader.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById('opportunity-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('opportunity-id').value;
  const data = {
    title: document.getElementById('title').value,
    type: document.getElementById('type').value,
    company: document.getElementById('company').value,
    workMode: document.getElementById('workMode').value,
    location: document.getElementById('location').value,
    prerequisites: document.getElementById('prerequisites').value,
    link: document.getElementById('link').value,
    expiration: document.getElementById('expiration').value ? new Date(document.getElementById('expiration').value) : null,
    image: document.getElementById('image').value,
    createdAt: serverTimestamp(),
    visible: true
  };

  try {
    if (id) {
      const ref = doc(db, 'opportunities', id);
      await updateDoc(ref, data);
      alert('Oportunidade atualizada!');
    } else {
      await addDoc(collection(db, 'opportunities'), data);
      alert('Oportunidade cadastrada!');
    }

    document.getElementById('opportunity-form').reset();
    loadOpportunities();

  } catch (err) {
    console.error(err);
    alert('Erro ao salvar oportunidade.');
  }
});

async function loadOpportunities() {
  const list = document.getElementById('opportunities-list');
  list.innerHTML = '';

  const snapshot = await getDocs(collection(db, 'opportunities'));

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    const card = document.createElement('div');
    card.className = 'opportunity-card';
    card.innerHTML = `
      <h4>${data.title}</h4>
      <p><strong>Empresa:</strong> ${data.company}</p>
      <p><strong>Tipo:</strong> ${data.type} | ${data.workMode}</p>
      <p><strong>Local:</strong> ${data.location}</p>
      <p><strong>Link:</strong> <a href="${data.link}" target="_blank">Candidatar-se</a></p>
      <button onclick="editOpportunity('${docSnap.id}')">Editar</button>
      <button onclick="toggleVisibility('${docSnap.id}', ${data.visible})">${data.visible ? 'Ocultar' : 'Reexibir'}</button>
      <button onclick="deleteOpportunity('${docSnap.id}')">Excluir</button>
    `;
    list.appendChild(card);
  });
}

window.editOpportunity = async function(id) {
  const snap = await getDoc(doc(db, 'opportunities', id));
  if (!snap.exists()) return alert('Oportunidade não encontrada');

  const data = snap.data();
  document.getElementById('opportunity-id').value = id;
  document.getElementById('title').value = data.title;
  document.getElementById('type').value = data.type;
  document.getElementById('company').value = data.company;
  document.getElementById('workMode').value = data.workMode;
  document.getElementById('location').value = data.location;
  document.getElementById('prerequisites').value = data.prerequisites;
  document.getElementById('link').value = data.link;
  document.getElementById('image').value = data.image;
  document.getElementById('expiration').value = data.expiration
    ? new Date(data.expiration.toDate ? data.expiration.toDate() : data.expiration).toISOString().split('T')[0]
    : '';
};

window.deleteOpportunity = async function(id) {
  if (!confirm('Deseja realmente excluir esta oportunidade?')) return;
  await deleteDoc(doc(db, 'opportunities', id));
  loadOpportunities();
};

window.toggleVisibility = async function(id, current) {
  await updateDoc(doc(db, 'opportunities', id), { visible: !current });
  loadOpportunities();
};

document.addEventListener('DOMContentLoaded', () => {
  loadOpportunities();
});