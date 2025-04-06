import { db } from './firebase.js';
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

async function loadCourses() {
  try {
    const snapshot = await getDocs(collection(db, 'courses'));
    const courses = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(course => course.visible);

    renderCourses(courses);
  } catch (err) {
    console.error('Erro ao carregar cursos:', err);
  }
}

function renderCourses(courses) {
  const container = document.getElementById('courses-list');
  container.innerHTML = '';

  courses.forEach(course => {
    const card = document.createElement('div');
    card.classList.add('course-card');

    card.innerHTML = `
      <img src="${course.image || '../img/default-event.png'}" alt="Imagem do curso">
      <div class="course-info">
        <h4>${course.title}</h4>
        <p>${course.description}</p>
        <p class="course-type">${course.isTrack ? 'Trilha de aprendizado' : 'Curso único'}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `/course-post?id=${course.id}`;
    });

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', loadCourses);
