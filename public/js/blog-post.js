import { db } from './firebase.js';
import {
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');

  if (!postId) {
    document.getElementById('post-content').innerHTML = '<p>Post não encontrado.</p>';
    return;
  }

  try {
    const docRef = doc(db, 'blogPosts', postId);
    const postSnap = await getDoc(docRef);

    if (!postSnap.exists()) {
      document.getElementById('post-content').innerHTML = '<p>Post não encontrado.</p>';
      return;
    }

    const post = postSnap.data();
    const d = post.date?.toDate?.() || new Date(post.date);

    document.getElementById('post-content').innerHTML = `
        <h2 class="post-title">${post.title}</h2>
        <figure class="post-image">
            <img src="${post.image || '../img/default-event.png'}" alt="Imagem do post" />
            <figcaption>${post.caption || ''}</figcaption>
        </figure>
        <div class="post-body">
            <p>${post.content.replace(/\n/g, '<br>')}</p>
        </div>
    `;

    const postsRef = collection(db, 'blog');
    const snapshot = await getDocs(postsRef);
    const list = document.getElementById('other-posts');
    snapshot.forEach(doc => {
      if (doc.id !== postId) {
        const data = doc.data();
        const li = document.createElement('li');
        li.innerHTML = `<a href="blog-post.html?id=${doc.id}">${data.title}</a>`;
        list.appendChild(li);
      }
    });

  } catch (err) {
    console.error('Erro ao carregar o post:', err);
    document.getElementById('post-content').innerHTML = '<p>Erro ao carregar o post.</p>';
  }
});
