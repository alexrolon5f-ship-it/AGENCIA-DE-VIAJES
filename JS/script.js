// modo oscuro
function cambiarmodo() {
  document.body.classList.toggle("dark");
  localStorage.setItem("modo", document.body.classList.contains("dark") ? "dark" : "light");
}

window.addEventListener("DOMContentLoaded", function () {
  const modo = localStorage.getItem("modo");
  if (modo === "dark") {
    document.body.classList.add("dark");
  }
});

// modal generico, funciona con cualquier div que tenga la clase modal
function abrirModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("activo");
}

function cerrarModal(modal) {
  if (modal) modal.classList.remove("activo");
}

document.addEventListener("click", function (event) {
  const botonAbrir = event.target.closest("[data-modal-open]");
  if (botonAbrir) {
    abrirModal(botonAbrir.dataset.modalOpen);
  }

  const botonCerrar = event.target.closest("[data-modal-close]");
  if (botonCerrar) {
    cerrarModal(botonCerrar.closest(".modal"));
  }

  // Cerrar al hacer click fuera del contenido
  if (event.target.classList.contains("modal")) {
    cerrarModal(event.target);
  }
});

const botonVolverArriba = document.createElement("button");
botonVolverArriba.className = "volver-arriba";
botonVolverArriba.setAttribute("aria-label", "Volver arriba");
botonVolverArriba.innerHTML = "&uarr;";
document.addEventListener("DOMContentLoaded", function () {
  document.body.appendChild(botonVolverArriba);
});

window.addEventListener("scroll", function () {
  if (window.scrollY > 400) {
    botonVolverArriba.classList.add("visible");
  } else {
    botonVolverArriba.classList.remove("visible");
  }
});

botonVolverArriba.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// scroll suave para los links que apuntan a una seccion de la misma pagina
document.addEventListener("click", function (event) {
  const enlace = event.target.closest('a[href^="#"]');
  if (enlace && enlace.getAttribute("href").length > 1) {
    const destino = document.querySelector(enlace.getAttribute("href"));
    if (destino) {
      event.preventDefault();
      const posicion = destino.getBoundingClientRect().top + window.scrollY - 70; // resto la altura del header fijo
      window.scrollTo({ top: posicion, behavior: "smooth" });
    }
  }
});

// slider del banner de inicio, va cambiando la foto de fondo cada 4 segundos
const fotosBanner = document.querySelectorAll(".portada-media");
if (fotosBanner.length) {
  let fotoActual = 0;
  fotosBanner[0].classList.add("activa"); // se arranca mostrando la primera foto

  setInterval(function () {
    fotosBanner[fotoActual].classList.remove("activa");
    fotoActual = (fotoActual + 1) % fotosBanner.length; // el % hace que vuelva a la 0 al llegar a la ultima
    fotosBanner[fotoActual].classList.add("activa");
  }, 4000);
}

// contador animado de las cifras del inicio, el numero de cada paso lo calcula el js
const numeros = document.querySelectorAll(".numero");
if (numeros.length) {
  let yaContado = false;

  function contar(span) {
    const hasta = parseInt(span.dataset.hasta, 10);
    const inicioTiempo = performance.now();
    const duracion = 1500;

    function paso(ahora) {
      const transcurrido = Math.min((ahora - inicioTiempo) / duracion, 1);
      span.textContent = Math.floor(transcurrido * hasta);
      if (transcurrido < 1) {
        requestAnimationFrame(paso);
      } else {
        span.textContent = hasta;
      }
    }
    requestAnimationFrame(paso);
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting && !yaContado) {
        yaContado = true;
        numeros.forEach(contar);
      }
    });
  }, { threshold: 0.4 });

  observador.observe(numeros[0].closest(".cifras"));
}

document.addEventListener("click", function (event) {
  const header = event.target.closest(".accordion-header");

  if (header) {
    const item = header.closest(".accordion-item");
    item.classList.toggle("activo");
  } else {

  }
});

// selector de moneda USD / Guaraníes, solo se agrega en las paginas que tienen precios
// tasa aproximada de agosto 2026, se usa solo para mostrar un valor de referencia
const TASA_CAMBIO_PYG = 6000;

document.addEventListener("DOMContentLoaded", function () {
  const preciosTexto = document.querySelectorAll(".precio");
  const botonesConPrecio = document.querySelectorAll("[data-precio]");

  if (!preciosTexto.length && !botonesConPrecio.length) return; // esta pagina no maneja precios

  preciosTexto.forEach(function (el) {
    el.dataset.usd = el.textContent;
  });
  botonesConPrecio.forEach(function (btn) {
    btn.dataset.precioUsd = btn.dataset.precio;
  });

  let monedaActual = "usd";

  function convertirTexto(textoUsd) {
    return textoUsd.replace(/\$(\d+)/, function (coincidencia, numero) {
      if (monedaActual === "usd") return "$" + numero;
      const enGuaranies = Math.round(parseInt(numero, 10) * TASA_CAMBIO_PYG);
      return "₲" + enGuaranies.toLocaleString("es-PY");
    });
  }

  function aplicarMoneda() {
    preciosTexto.forEach(function (el) {
      el.textContent = convertirTexto(el.dataset.usd);
    });
    botonesConPrecio.forEach(function (btn) {
      btn.dataset.precio = convertirTexto(btn.dataset.precioUsd);
    });
  }

  const botonMoneda = document.createElement("button");
  botonMoneda.type = "button";
  botonMoneda.className = "moneda-boton";
  botonMoneda.setAttribute("aria-label", "Cambiar a Guaraníes");
  botonMoneda.textContent = "USD";

  const botonTema = document.querySelector(".temas");
  if (botonTema) {
    const contenedor = document.createElement("div");
    contenedor.className = "controles-header";
    botonTema.insertAdjacentElement("beforebegin", contenedor);
    contenedor.appendChild(botonTema);
    contenedor.appendChild(botonMoneda);
  }

  botonMoneda.addEventListener("click", function () {
    monedaActual = monedaActual === "usd" ? "pyg" : "usd";
    botonMoneda.textContent = monedaActual === "usd" ? "USD" : "₲ PYG";
    botonMoneda.setAttribute("aria-label", monedaActual === "usd" ? "Cambiar a Guaraníes" : "Cambiar a Dólares");
    aplicarMoneda();
  });
});

// banner de cookies, aparece una vez y ya no se muestra mas gracias al localStorage
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("cookiesAceptadas") === "si") return;

  const banner = document.createElement("div");
  banner.className = "banner-cookies";
  banner.innerHTML =
    '<p>Usamos cookies propias para mejorar tu experiencia de navegación. Podés leer más en nuestra <a href="privacidad.html">Política de Privacidad</a>.</p>' +
    '<button type="button" class="boton boton-cookies">Aceptar</button>';

  document.body.appendChild(banner);
  requestAnimationFrame(function () {
    banner.classList.add("visible");
  });

  banner.querySelector(".boton-cookies").addEventListener("click", function () {
    localStorage.setItem("cookiesAceptadas", "si");
    banner.classList.remove("visible");
    setTimeout(function () {
      banner.remove();
    }, 400);
  });
});
