class Layout {
  static loadSharedContent() {
    fetch('../html/header.html')
      .then(res => res.text())
      .then(data => {
        document.body.insertAdjacentHTML('afterbegin', data);
      });

    fetch('../html/footer.html')
      .then(res => res.text())
      .then(data => {
        document.body.insertAdjacentHTML('beforeend', data);
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Layout.loadSharedContent();
});
