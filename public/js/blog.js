import { db } from './firebase.js';
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

async function loadBlogPosts() {
  const snapshot = await getDocs(query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc')));
  const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderPosts(posts);
  renderMenu(posts);
}

function renderPosts(posts) {
  const container = document.getElementById('blog-posts');
  container.innerHTML = '';

  posts.forEach(post => {
    const card = document.createElement('div');
    card.classList.add('blog-card');
    card.innerHTML = `
      <img src="${post.image || '../img/default-event.png'}" alt="Thumb" />
      <div class="blog-info">
        <h4>${post.title}</h4>
        <p>${(post.content || '').slice(0, 120)}...</p>
        <small>${new Date(post.createdAt?.toDate?.() || post.createdAt).toLocaleDateString('pt-BR')}</small>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `/blog/post?id=${post.id}`;
    });
    container.appendChild(card);
  });
}

function renderMenu(posts) {
  const menu = document.getElementById('blog-menu');
  menu.innerHTML = '';
  posts.forEach(post => {
    const li = document.createElement('li');
    li.textContent = post.title;
    li.addEventListener('click', () => {
        window.location.href = `/blog/post?id=${post.id}`;
    });
    menu.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', loadBlogPosts);
