import { db } from './firebase.js';
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.getElementById('blog-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('post-id').value;
  const title = document.getElementById('title').value;
  const image = document.getElementById('image').value;
  const caption = document.getElementById('caption').value;
  const content = document.getElementById('content').value;

  const payload = {
    title, image, caption, content,
    createdAt: serverTimestamp(),
    visible: true
  };

  try {
    if (id) {
      const ref = doc(db, 'blogPosts', id);
      await updateDoc(ref, payload);
      alert('Post atualizado!');
    } else {
      await addDoc(collection(db, 'blogPosts'), payload);
      alert('Post criado!');
    }

    document.getElementById('blog-form').reset();
    loadPosts();
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar post.');
  }
});

async function loadPosts() {
  const snapshot = await getDocs(collection(db, 'blogPosts'));
  const list = document.getElementById('blog-posts-list');
  list.innerHTML = '';

  snapshot.forEach(docSnap => {
    const post = docSnap.data();
    const div = document.createElement('div');
    div.className = 'post-card';
    div.innerHTML = `
      <h4>${post.title}</h4>
      <p>${(post.content || '').slice(0, 100)}...</p>
      <button onclick="editPost('${docSnap.id}')">Editar</button>
      <button onclick="toggleVisibility('${docSnap.id}', ${post.visible})">${post.visible ? 'Ocultar' : 'Reexibir'}</button>
      <button onclick="deletePost('${docSnap.id}')">Excluir</button>
    `;
    list.appendChild(div);
  });
}

window.editPost = async function(id) {
  const ref = doc(db, 'blogPosts', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return alert('Post não encontrado');

  const post = snap.data();
  document.getElementById('post-id').value = id;
  document.getElementById('title').value = post.title;
  document.getElementById('image').value = post.image;
  document.getElementById('caption').value = post.caption;
  document.getElementById('content').value = post.content;
};

window.deletePost = async function(id) {
  if (!confirm('Tem certeza que deseja excluir este post?')) return;
  await deleteDoc(doc(db, 'blogPosts', id));
  loadPosts();
};

window.toggleVisibility = async function(id, visible) {
  await updateDoc(doc(db, 'blogPosts', id), { visible: !visible });
  loadPosts();
};

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
