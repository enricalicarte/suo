function loadFragment(id, file) {
  return fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    })
    .catch(err => console.error(`Error al cargar ${file}:`, err));
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadFragment("header", "header.html"),
    loadFragment("footer", "footer.html")
  ]);

  // 🔥 Aquí ejecutamos el resto del script SOLO cuando el header ya existe
  initScripts();
});
