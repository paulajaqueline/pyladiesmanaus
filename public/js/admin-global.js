document.addEventListener('DOMContentLoaded', () => {

    fetch('/html/admin-header.html')
      .then(res => res.text())
      .then(data => {
        const div = document.createElement('div');
        div.innerHTML = data;
        document.body.insertBefore(div, document.body.firstChild);
      });

    fetch('/html/admin-footer.html')
      .then(res => res.text())
      .then(data => {
        const div = document.createElement('div');
        div.innerHTML = data;
        document.body.appendChild(div);
      });
  });
