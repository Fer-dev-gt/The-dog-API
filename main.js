const API_KEY = 'api_key=live_n1ykKZKQyBVMv3bkbwcuZGnc9qtZUwneLCROUduvX4m7eJLgUhwetUf1M1HfDadJ';
const API_URL_RANDOM = `https://api.thedogapi.com/v1/images/search?limit=2&${API_KEY}J`;                    // API de perritos, utlizo "Query Parameters" para filtrar y manejar la cantidad de objetos que solicito (?limit=3&page=2)
const API_URL_FAVORITES = `https://api.thedogapi.com/v1/favourites?&${API_KEY}`;         
const API_URL_FAVORITES_DELETE = (id) => `https://api.thedogapi.com/v1/favourites/${id}?${API_KEY}`;         

const spanError = document.getElementById('error');
const botonCambiarPerrito = document.querySelector('#cambiarPerrito');
botonCambiarPerrito.onclick = loadRandomPerritos;

loadRandomPerritos();
loadFavouritePerritos();


async function loadRandomPerritos() {                                       // Muestra fotos de perritos al azar usando Async/Await y verifanco que el HTTP code sea 200
  const response = await fetch(API_URL_RANDOM);
  const data = await response.json();                                       // El método ".json()" tambien es asincrono

  console.log('🟡Random');
  console.log(data)

  if(response.status !== 200) {                                             // Verificadmos que el "response.status" es cualquier cosa distinta a 200, si no es 200 muestro un mensaje de error
    spanError.innerHTML = "Hubo un error: " + response.status;
  } else {
    const imgPerrito1 = document.querySelector('#perroAleatorio1');
    const imgPerrito2 = document.querySelector('#perroAleatorio2');
    const btn1 = document.querySelector('#btn1')
    const btn2 = document.querySelector('#btn2')
    imgPerrito1.src = data[0].url;
    imgPerrito2.src = data[1].url;

    btn1.onclick = () => saveFavouritePerrito(data[0].id);
    btn2.onclick = () => saveFavouritePerrito(data[1].id);
  }


  const title = document.getElementById("titlePerrito");

  try { title.innerText = data[0].breeds[0].name;
  } catch { console.log("Raza desconocida"); } 
}




async function loadFavouritePerritos(){                                     // Carga foto de perros favoritos
  const response = await fetch(API_URL_FAVORITES);
  const data = await response.json();
  console.log('🩷Favoritos');
  console.log(data);

  if(response.status !== 200) {                                             // Verificadmos que el "response.status" es cualquier cosa distinta a 200, si no es 200 muestro un mensaje de error
    spanError.innerHTML = "Hubo un error: " + response.status + response.text;  //+ data.message;
  } else {
    const section = document.getElementById('favoritePerritos');
    section.innerHTML = "";
    const h2 = document.createElement('h2');
    const h2Text = document.createTextNode('Perris Favoritos');
    h2.appendChild(h2Text);
    section.appendChild(h2);

    data.forEach(perrito => {
      const article = document.createElement('article');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      const btnText = document.createTextNode('Sacar al perris de favoritos');

      img.src = perrito.image.url
      img.width = 450;
      btn.appendChild(btnText);
      btn.onclick = () => deleteFavouritePerrito(perrito.id);
      article.appendChild(img);
      article.appendChild(btn);
      section.append(article);
    });
  }
}



async function saveFavouritePerrito(id) {                                   // Guarda un objeto de un perrito en la lista de Favorites usando el método "POST"
  const response = await fetch(API_URL_FAVORITES, {                         // Vamos a enviar un Objeto en el segundo parámetro con la información de lo que vamos a subir y el formato indicado, esto sucede cada vez que hacemos una solicitud que no sea la de por defecto "GET"
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({                                                  // En el "body" mandamos precisamente la información del dato que vamos a guardar y le aplicamos el método "stringify"
      image_id: id
    }),
  });
  const data = await response.json();
  console.log(data.message);

  console.log('Save');
  console.log(response);

  if(response.status !== 200) {                                                 // Verificadmos que el "response.status" es cualquier cosa distinta a 200, si no es 200 muestro un mensaje de error
    spanError.innerText = "Hubo un error: " + response.status + data.message;
    console.log(data);
  } else {
    console.log('Perrito guardado en favoritos');
    loadFavouritePerritos();
  }
}


async function deleteFavouritePerrito(id) {
  const response = await fetch(API_URL_FAVORITES_DELETE(id), {
    method: 'DELETE',
  });
  //const data = await response.json();

  if(response.status !== 200) {                                                 // Verificadmos que el "response.status" es cualquier cosa distinta a 200, si no es 200 muestro un mensaje de error
    console.log("noooooooo");
    spanError.innerText = "Hubo un error: " + response.status + data.message;
    console.log(data);
  } else {
    console.log('Perrito ELIMINADO en favoritos');
    loadFavouritePerritos();
  }
}














































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
