
const form = document.getElementById("formularioPeliculas");
const tbody = document.getElementById("cuerpoTabla");

let peliculasNuevas = [];
let filaEditar = null;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const url = event.target.urlFoto.value;
  const titulo = event.target.titulo.value;
  const anno = event.target.anno.value;
  const descripcion = event.target.descripcion.value;
  const genero = event.target.genero.value;

  const tituloRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{3,100}$/;
  const annoRegex = /^(18[0-9]{2}|19[0-9]{2}|20[0-2][0-9]|202[0-6])$/;
  const descripcionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,]{3,100}$/;

  let mensajesError = "";

  if (!tituloRegex.test(titulo)) {
    mensajesError += "El título debe tener entre 3 y 100 caracteres.\n";
  }

  if (!annoRegex.test(anno)) {
    mensajesError += "El año debe estar entre 1800 y 2026.\n";
  }

  if (!descripcionRegex.test(descripcion)) {
    mensajesError += "La descripción debe tener entre 3 y 100 caracteres.\n";
  }

  if (mensajesError) {
    alert(mensajesError);
    return;
  }

  const pelicula = { url, titulo, anno, descripcion, genero };

  if (filaEditar) {
    // Actualizar la película del array, si está en él
    const indice = Number(filaEditar.dataset.indice);

    if (Number.isInteger(indice) && indice >= 0) {
      peliculasNuevas[indice] = pelicula;
    }
  } else {
    peliculasNuevas.push(pelicula);
  }

  let fila = filaEditar || document.createElement("tr");

  fila.innerHTML = `
    <td>
      <img src="${url}" alt="${titulo}" width="100">
    </td>
    <td class="tituloCelda">${titulo}</td>
    <td class="annoCelda">${anno}</td>
    <td class="descripcionCelda">${descripcion}</td>
    <td>${genero}</td>
    <td>
      <button class="btnEditar" type="button">
        <img class="iconos" src="assets/editar.png" alt="Editar">
      </button>
      <button class="btnEliminar" type="button">
        <img class="iconos" src="assets/delete.png" alt="Eliminar">
      </button>
    </td>
  `;

  if (!filaEditar) {
    fila.dataset.indice = peliculasNuevas.length - 1;
    tbody.appendChild(fila);
  }

  filaEditar = null;
  form.querySelector("button").textContent = "Añadir película";
  form.reset();
});

tbody.addEventListener("click", (event) => {
  const botonEliminar = event.target.closest(".btnEliminar");
  const botonEditar = event.target.closest(".btnEditar");

  if (botonEliminar) {
    const fila = botonEliminar.closest("tr");

    const indice = Number(fila.dataset.indice);
    if (Number.isInteger(indice) && indice >= 0) {
      peliculasNuevas[indice] = null;
    }

    if (filaEditar === fila) {
      filaEditar = null;
      form.reset();
      form.querySelector("button").textContent = "Añadir película";
    }

    fila.remove();
  }

  if (botonEditar) {
    const fila = botonEditar.closest("tr");

    form.titulo.value = fila.cells[1].textContent.trim();
    form.anno.value = fila.cells[2].textContent.trim();
    form.descripcion.value = fila.cells[3].textContent.trim();
    form.genero.value = fila.cells[4].textContent.trim();
    form.urlFoto.value = fila.cells[0].querySelector("img").getAttribute("src");

    filaEditar = fila;
    form.querySelector("button").textContent = "Guardar cambios";
  }
});
