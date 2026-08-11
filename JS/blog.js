// Maneja el modal de "leer más" en la página de blog/noticias
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modalNoticia");

  if (modal) {
    const fecha = document.getElementById("noticiaFecha");
    const titulo = document.getElementById("noticiaTitulo");
    const contenido = document.getElementById("noticiaContenido");

    const linkWhatsapp = document.getElementById("compartirWhatsapp");
    const linkFacebook = document.getElementById("compartirFacebook");
    const linkX = document.getElementById("compartirX");
    const urlPagina = window.location.href.split("#")[0];

    document.querySelectorAll(".leer-mas").forEach(function (boton) {
      boton.addEventListener("click", function () {
        fecha.textContent = this.dataset.fecha;
        titulo.textContent = this.dataset.titulo;
        contenido.textContent = this.dataset.contenido;
        modal.classList.add("activo");

        // arma los links de compartir con el titulo de la noticia que se esta mostrando
        const textoCompartir = encodeURIComponent(this.dataset.titulo + " - TravelPy");
        const urlCompartir = encodeURIComponent(urlPagina);
        if (linkWhatsapp) linkWhatsapp.href = "https://wa.me/?text=" + textoCompartir + "%20" + urlCompartir;
        if (linkFacebook) linkFacebook.href = "https://www.facebook.com/sharer/sharer.php?u=" + urlCompartir;
        if (linkX) linkX.href = "https://twitter.com/intent/tweet?text=" + textoCompartir + "&url=" + urlCompartir;
      });
    });

  } else {

  }
});

// barra de progreso de lectura, avanza segun cuanto se scrolleo la pagina del blog
document.addEventListener("DOMContentLoaded", function () {
  const barra = document.getElementById("barraProgreso");
  if (!barra) return;

  window.addEventListener("scroll", function () {
    const alturaTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progreso = alturaTotal > 0 ? (window.scrollY / alturaTotal) * 100 : 0;
    barra.style.width = progreso + "%";
  });
});
