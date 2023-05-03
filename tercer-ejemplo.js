// Realizo una petición tipo GET y luego usando Promesas hago que se muestre la iamgen del perrito usando manipulación del DOM
const botonCambiarPerrito = document.querySelector('#cambiarPerrito');
botonCambiarPerrito.addEventListener('click', ()=>{
  fetch(API_URL)                                                    // Hacemos la solicitud y procesamos los datos
  .then(res => res.json())                                          // Convierto la info en formato JSON
  .then(data => {                                                   // Recibo la información en formato JSON la guardo en variable "data" que es un Array
    const imgPerrito = document.querySelector('#gatitoAleatorio');  // Hago una manipulación del DOM para insertar la foto del perrito
    imgPerrito.src = data[0].url;                                   // Inserto el valor de la url a la propiedad ".src" de mi imagen para que muestre a un perrito
  });
});
