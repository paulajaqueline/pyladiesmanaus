import { db } from './firebase.js';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  serverTimestamp, query, where
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const form = document.getElementById('course-form');
const list = document.getElementById('course-list');
const modPanel = document.getElementById('moderation-panel');
const qList = document.getElementById('questions-list');
const cList = document.getElementById('comments-list');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('course-id').value;
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const image = document.getElementById('image').value;
  const isTrack = document.getElementById('isTrack').checked;
  const link = document.getElementById('link').value;
  let videos = [];

  try {
    if (isTrack && document.getElementById('videos').value.trim()) {
      videos = JSON.parse(document.getElementById('videos').value);
    }
  } catch (err) {
    return alert('Erro no JSON da trilha. Corrija antes de salvar.');
  }

  const payload = {
    title, description, image, isTrack, link, videos,
    createdAt: serverTimestamp(),
    visible: true
  };

  try {
    if (id) {
      await updateDoc(doc(db, 'courses', id), payload);
      alert('Curso atualizado!');
    } else {
      await addDoc(collection(db, 'courses'), payload);
      alert('Curso criado!');
    }
    form.reset();
    loadCourses();
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar curso.');
  }
});

async function loadCourses() {
  const snapshot = await getDocs(collection(db, 'courses'));
  list.innerHTML = '';

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
      <h4>${data.title}</h4>
      <button onclick="editCourse('${docSnap.id}')">Editar</button>
      <button onclick="toggleVisibility('${docSnap.id}', ${data.visible})">${data.visible ? 'Ocultar' : 'Reexibir'}</button>
      <button onclick="deleteCourse('${docSnap.id}')">Excluir</button>
      <button onclick="moderate('${docSnap.id}')">Moderar</button>
    `;
    list.appendChild(card);
  });
}

window.editCourse = async function(id) {
  const snap = await getDoc(doc(db, 'courses', id));
  if (!snap.exists()) return alert('Curso não encontrado');
  const c = snap.data();

  document.getElementById('course-id').value = id;
  document.getElementById('title').value = c.title;
  document.getElementById('description').value = c.description;
  document.getElementById('image').value = c.image;
  document.getElementById('isTrack').checked = c.isTrack;
  document.getElementById('link').value = c.link || '';
  document.getElementById('videos').value = JSON.stringify(c.videos || [], null, 2);
};

window.toggleVisibility = async function(id, visible) {
  await updateDoc(doc(db, 'courses', id), { visible: !visible });
  loadCourses();
};

window.deleteCourse = async function(id) {
  if (!confirm('Deseja excluir este curso?')) return;
  await deleteDoc(doc(db, 'courses', id));
  loadCourses();
};

window.moderate = async function (courseId) {
  modPanel.classList.remove('hidden');
  qList.innerHTML = '';
  cList.innerHTML = '';

  const qSnap = await getDocs(query(
    collection(db, `courses/${courseId}/questions`),
    where('approved', '==', false)
  ));

  const cSnap = await getDocs(query(
    collection(db, `courses/${courseId}/comments`),
    where('approved', '==', false)
  ));

  qSnap.forEach(doc => {
    const d = doc.data();
    const div = document.createElement('div');
    div.className = 'question-card';
    div.innerHTML = `
      <p><strong>${d.name}</strong> perguntou:</p>
      <p>${d.content}</p>
      <p><strong>Email:</strong> ${d.email}</p>
      <p><strong>Telefone:</strong> ${d.phone}</p>
      <textarea placeholder="Responder..." id="resp-${doc.id}">${d.response || ''}</textarea>
      <button onclick="approveQuestion('${courseId}', '${doc.id}')">Aprovar</button>
      <button onclick="deleteQuestion('${courseId}', '${doc.id}')">Excluir</button>
    `;
    qList.appendChild(div);
  });

  cSnap.forEach(doc => {
    const d = doc.data();
    const div = document.createElement('div');
    div.className = 'comment-card';
    div.innerHTML = `
      <p><strong>${d.name}</strong> comentou:</p>
      <p>${d.content}</p>
      <p><strong>Email:</strong> ${d.email}</p>
      <p><strong>Telefone:</strong> ${d.phone}</p>
      <button onclick="approveComment('${courseId}', '${doc.id}')">Aprovar</button>
      <button onclick="deleteComment('${courseId}', '${doc.id}')">Excluir</button>
    `;
    cList.appendChild(div);
  });
};

window.approveQuestion = async function(courseId, qid) {
  const response = document.getElementById(`resp-${qid}`).value;
  await updateDoc(doc(db, `courses/${courseId}/questions`, qid), {
    approved: true,
    response
  });
  window.moderate(courseId);
};

window.deleteQuestion = async function(courseId, qid) {
  await deleteDoc(doc(db, `courses/${courseId}/questions`, qid));
  window.moderate(courseId);
};

window.approveComment = async function(courseId, cid) {
  await updateDoc(doc(db, `courses/${courseId}/comments`, cid), {
    approved: true
  });
  window.moderate(courseId);
};

window.deleteComment = async function(courseId, cid) {
  await deleteDoc(doc(db, `courses/${courseId}/comments`, cid));
  window.moderate(courseId);
};

document.addEventListener('DOMContentLoaded', loadCourses);
