import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  const responseMsg = document.getElementById('response-msg');

  try {
    await addDoc(collection(db, 'contacts'), {
      name,
      email,
      subject,
      message,
      createdAt: serverTimestamp()
    });

    responseMsg.textContent = "Mensagem enviada com sucesso!";
    responseMsg.style.color = "green";
    document.getElementById('contact-form').reset();
  } catch (err) {
    console.error('Erro ao enviar contato:', err);
    responseMsg.textContent = "Erro ao enviar mensagem.";
    responseMsg.style.color = "red";
  }
});
