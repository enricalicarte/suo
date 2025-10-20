document.addEventListener("DOMContentLoaded", () => {
  const loadFragment = (id, file) => {
    fetch(file)
      .then((res) => res.text())
      .then((html) => {
        document.getElementById(id).innerHTML = html;
      })
      .catch((err) => console.error(`Error al cargar ${file}:`, err));
  };

  loadFragment("header", "header.html");
  loadFragment("footer", "footer.html");
});
