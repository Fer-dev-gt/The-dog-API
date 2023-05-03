const API_URL = 'https://api.thedogapi.com/v1/images/search ';         // API de perritos
const title = document.getElementsByClassName("card__title");

fotoPerrito();

async function fotoPerrito(){
  const response = await fetch(API_URL);
  const data = await response.json();
  const imgPerrito = document.querySelector('#perroAleatorio');
  imgPerrito.src = data[0].url;
  if (data[0].breeds[0]) {
    title.innerText = data[0].breeds[0].name;
  }
}

const botonCambiarPerrito = document.querySelector('#cambiarPerrito');
botonCambiarPerrito.onclick = fotoPerrito;



/*
const botonCambiarPerrito = document.querySelector('#cambiarPerrito');
botonCambiarPerrito.addEventListener('click',()=>{
  fetch(API_URL)                                                    // Hacemos la solicitud y procesamos los datos
  .then(res => res.json())                                          // Convierto la info en formato JSON
  .then(data => {                                                   // Recibo la información en formato JSON la guardo en variable "data" que es un Array
    const imgPerrito = document.querySelector('#gatitoAleatorio');  // Hago una manipulación del DOM para insertar la foto del perrito
    imgPerrito.src = data[0].url;                                   // Inserto el valor de la url a la propiedad ".src" de mi imagen para que muestre a un perrito
  });
});
*/