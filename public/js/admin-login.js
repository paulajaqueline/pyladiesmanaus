import { db } from './firebase.js';
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

class AdminAuth {
  static async getAdminCredential(email) {
    const q = query(collection(db, 'admin_users'), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  }

  static async validateCredential(email, password) {
    const cred = await AdminAuth.getAdminCredential(email);
    if (!cred) return false;
    return cred.password === password;
  }

  static async grantAccess() {
    localStorage.setItem('admin_logged', 'true');
    await new Promise(resolve => setTimeout(resolve, 50));
    window.location.href = '/admin/volunteer';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('admin-login-form');
  const errorMsg = document.getElementById('error-msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const isValid = await AdminAuth.validateCredential(email, password);

    if (isValid) {
      AdminAuth.grantAccess();
    } else {
      errorMsg.textContent = 'E-mail ou senha inválidos.';
      errorMsg.style.display = 'block';
    }
  });
});
