import { db } from './firebase.js';
import {
  doc, getDoc, collection, addDoc, getDocs, query, where, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

function getCourseId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

async function loadCourseData() {
  const id = getCourseId();
  if (!id) return alert('Curso não encontrado.');

  const ref = doc(db, 'courses', id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return alert('Curso não encontrado.');

  const data = snap.data();
  renderCourseDetails(data);
  if (data.isTrack && data.videos?.length) renderVideoTrack(data.videos);
  loadApprovedFeedback(id);
}

function renderCourseDetails(course) {
  const container = document.getElementById('course-details');
  container.innerHTML = `
    <h2>${course.title}</h2>
    <img src="${course.image}" alt="${course.title}" class="course-image">
    <p>${course.description}</p>
    ${!course.isTrack && course.link ? `<a href="${course.link}" target="_blank" class="apply-button">Acessar curso</a>` : ''}
  `;
}

function renderVideoTrack(videos) {
  const section = document.getElementById('videos-section');
  section.innerHTML = `<h3>Trilha de vídeos</h3>`;

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('video-cards');

  videos.forEach(v => {
    const card = document.createElement('div');
    card.classList.add('video-card');

    const title = document.createElement('h4');
    title.textContent = v.title;

    const link = document.createElement('a');
    link.href = v.url;
    link.target = '_blank';
    link.textContent = 'Acessar vídeo';

    card.appendChild(title);
    card.appendChild(link);
    cardsContainer.appendChild(card);
  });

  section.appendChild(cardsContainer);
}

async function loadApprovedFeedback(courseId) {
    const container = document.getElementById('feedback-list');
    container.innerHTML = '<h4>Dúvidas e comentários aprovados</h4>';

    const qSnapshot = await getDocs(query(
        collection(db, `courses/${courseId}/questions`),
        where("approved", "==", true)
    ));

    const cSnapshot = await getDocs(query(
        collection(db, `courses/${courseId}/comments`),
        where("approved", "==", true)
    ));

    const allFeedback = [];

    qSnapshot.forEach(doc => {
        const d = doc.data();
        allFeedback.push({
            type: 'question',
            name: d.name,
            content: d.content,
            response: d.response
        });
    });

    cSnapshot.forEach(doc => {
        const d = doc.data();
        allFeedback.push({
            type: 'comment',
            name: d.name,
            content: d.content
        });
    });

    allFeedback.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('feedback-card');
        div.innerHTML = `
        <p><strong>${item.name} ${item.type === 'question' ? 'perguntou' : 'comentou'}:</strong></p>
        <p>${item.content}</p>
        ${item.response ? `<p><em>Resposta:</em> ${item.response}</p>` : ''}
      `;
        container.appendChild(div);
    });
}

async function handleSubmit(formId, subcollection) {
  const id = getCourseId();
  const form = document.getElementById(formId);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const phone = form.querySelector('input[type="tel"]').value.trim();
    const content = form.querySelector('textarea').value.trim();

    if (!name || !email || !phone || !content) return alert('Preencha todos os campos');

    try {
      await addDoc(collection(db, `courses/${id}/${subcollection}`), {
        name, email, phone, content,
        approved: false,
        response: '',
        createdAt: serverTimestamp()
      });

      alert('Enviado para análise!');
      form.reset();
    } catch (err) {
      console.error(`Erro ao enviar ${subcollection}:`, err);
      alert('Erro ao enviar. Tente novamente.');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadCourseData();
  handleSubmit('question-form', 'questions');
  handleSubmit('comment-form', 'comments');
});
