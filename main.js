const api = axios.create({                                                                                            // Creo una nueva instancia de Axios con el método ".create()" y adentro escribo las instrucciones que quiero que se aplique a mis solicitudes
  baseURL: 'https://api.thedogapi.com/v1/'                                                                            // Escribo mi url Base para que sea mas facil inplementarla en mis solicitudes
});
api.defaults.headers.common['X-API-KEY'] = 'live_n1ykKZKQyBVMv3bkbwcuZGnc9qtZUwneLCROUduvX4m7eJLgUhwetUf1M1HfDadJ';   // Tambien puedo agregar información adicional a mi Objeto de Axios de arriba usando el método (.defaults.headers.common['x-api-key'])

const API_URL_RANDOM = `https://api.thedogapi.com/v1/breeds?`;                                          // API de perritos, utlizo "Query Parameters" para filtrar y manejar la cantidad de objetos que solicito (?limit=3&page=2)
const API_URL_FAVORITES = `https://api.thedogapi.com/v1/favourites`;                
const API_URL_FAVORITES_UPLOAD = `https://api.thedogapi.com/v1/images/upload`; 
const API_URL_FAVORITES_DELETE = (id) => `https://api.thedogapi.com/v1/favourites/${id}`;  

const spanError = document.getElementById('error');
const botonCambiarPerrito = document.querySelector('#cambiarPerrito');
botonCambiarPerrito.onclick = loadRandomPerritos;

loadRandomPerritos();
loadFavouritePerritos();

function generateRandomNumber() {                                                             // Genera un número aleatoreo del 0 al 171 relacionado a la cantidad de objetos de perrito con la información de la raza e imagen
  return Math.floor(Math.random() * 172) + 1;
}

async function loadRandomPerritos() {                                                         // Muestra fotos de perritos al azar usando Async/Await y verifanco que el HTTP code sea 200
  const response = await fetch(API_URL_RANDOM);
  const data = await response.json();                                                         // El método ".json()" tambien es asincrono
  console.log(`🟡Lista de perritos Random`);
  console.dir(data)

  const perritoRandom1id = generateRandomNumber(); 
  const perritoRandom2id = generateRandomNumber(); 
  console.log(`Id del primer perrito: ${perritoRandom1id}`);
  console.log(`Id del segundo perrito: ${perritoRandom2id}`);

  if(response.status !== 200) {                                                               // Verificadmos que el "response.status" es cualquier cosa distinta a 200, si no es 200 muestro un mensaje de error
    spanError.innerHTML = "Hubo un error: " + response.status + response.text;
  } else {
    try {
      const imgPerrito1 = document.querySelector('#perroAleatorio1');
      const imgPerrito2 = document.querySelector('#perroAleatorio2');
      const btn1 = document.querySelector('#btn1')
      const btn2 = document.querySelector('#btn2')
      imgPerrito1.src = data[perritoRandom1id].image.url;
      imgPerrito2.src = data[perritoRandom2id].image.url;
  
      btn1.onclick = () => saveFavouritePerrito(data[perritoRandom1id].image.id);
      btn2.onclick = () => saveFavouritePerrito(data[perritoRandom2id].image.id);
  
      const title1 = document.getElementById("titlePerrito1");
      const title2 = document.getElementById("titlePerrito2");
  
      title1.innerText = data[perritoRandom1id].name;
      title2.innerText = data[perritoRandom2id].name;
  
      const weight1 = document.getElementById('weight1');
      const height1 = document.getElementById('height1');
      const lifespan1 = document.getElementById('lifespan1');
  
      const weight2 = document.getElementById('weight2');
      const height2 = document.getElementById('height2');
      const lifespan2 = document.getElementById('lifespan2');
  
      weight1.innerText = `Weight: ${data[perritoRandom1id].weight.metric} lbs.`
      height1.innerText = `Height: ${data[perritoRandom1id].height.metric} cm.`
      lifespan1.innerText = `Lifespan: ${data[perritoRandom1id].life_span}.`

      weight2.innerText = `Weight: ${data[perritoRandom2id].weight.metric} lbs.`
      height2.innerText = `Height: ${data[perritoRandom2id].height.metric} cm.`
      lifespan2.innerText = `Lifespan: ${data[perritoRandom2id].life_span}.`
    } catch { 
      console.log("Raza desconocida"); 
    } 
  }  
}



async function loadFavouritePerritos(){                                                     // Carga foto de perros favoritos
  const response = await fetch(API_URL_FAVORITES, {
    method: 'GET',
    headers: {
      'X-API-Key': 'live_n1ykKZKQyBVMv3bkbwcuZGnc9qtZUwneLCROUduvX4m7eJLgUhwetUf1M1HfDadJ',
    },
  });
  const data = await response.json();
  console.log('🩷Lista de perritos Favoritos');
  console.dir(data);

  if(response.status !== 200) {                                                             // Verificadmos que el "response.status" es cualquier cosa distinta a 200, si no es 200 muestro un mensaje de error
    spanError.innerHTML = "Hubo un error: " + response.status + response.text;              //+ data.message;
  } else {
    const section = document.getElementById('favoritePerritos');
    section.innerHTML = "";

    data.forEach(perrito => {
      const article = document.createElement('article');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      const btnText = document.createTextNode('Sacar al perris de favoritos');

      img.src = perrito.image.url
      img.width = 450;
      btn.appendChild(btnText);
      btn.onclick = () => deleteFavouritePerrito(perrito.id);
      article.append(img, btn);
      section.append(article);
    });
  }
}



async function saveFavouritePerrito(id) {                                                   // Guarda un objeto de un perrito en la lista de Favorites usando el método "POST"
  /*    Lo comente para hacer la misma petición pero usando AXIOS
  const response = await fetch(API_URL_FAVORITES, {                                         // Vamos a enviar un Objeto en el segundo parámetro con la información de lo que vamos a subir y el formato indicado, esto sucede cada vez que hacemos una solicitud que no sea la de por defecto "GET"
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': 'live_n1ykKZKQyBVMv3bkbwcuZGnc9qtZUwneLCROUduvX4m7eJLgUhwetUf1M1HfDadJ'
    },
    body: JSON.stringify({                                                                  // En el "body" mandamos precisamente la información del dato que vamos a guardar y le aplicamos el método "stringify"
      image_id: id
    }),
  });
  const data = await response.json();
  */

  const { data, status } = await api.post('/favourites', {                                  // En vez de enviar el verbo POST en los headers, con Axios puedo usarlo con el método ".post()" y como parametro solo completo el endpoint a mi url Baso "/favourites", y el segundo parámetro enviamos un objeto body con la info de lo que queremos enviar
    image_id: id,                                                                           // Con Axios ya no tenemos que hacer el "JSON.stringify" este ya lo hace por nosotros
  });                                                 
  console.log('Save');
  console.log(status);

  //if(response.status !== 200) {                                                             // Verificadmos que el "response.status" es cualquier cosa distinta a 200, si no es 200 muestro un mensaje de error
  if(status !== 200) {
    spanError.innerText = "Hubo un error: " + status;
    console.log(data);
  } else {
    console.log('Perrito guardado en favoritos');
    loadFavouritePerritos();
  }
}



async function deleteFavouritePerrito(id) {                                                   // Borra de la lista de Favoritos al objeto seleccionado con el parámetro "id"
  const response = await fetch(API_URL_FAVORITES_DELETE(id), {
    method: 'DELETE',
    headers: {
      'X-API-KEY': 'live_n1ykKZKQyBVMv3bkbwcuZGnc9qtZUwneLCROUduvX4m7eJLgUhwetUf1M1HfDadJ'
    }
  });
  //const data = await response.json();

  if(response.status !== 200) {                                                             // Verificadmos que el "response.status" es cualquier cosa distinta a 200, si no es 200 muestro un mensaje de error
    console.log("noooooooo");
    spanError.innerText = "Hubo un error: " + response.status + data.message;
    console.log(data);
  } else {
    console.log('Perrito ELIMINADO en favoritos');
    loadFavouritePerritos();
  }
}

async function uploadPerritoPhoto() {                                                         // Guarda la información de  un DataForm en donde subimos una foto de nuestra computadora para despues usando fetch() la subimos a nuestra lista de favoritos y la subimos al API
  const form = document.getElementById('uploadingForm');                                      // Aqui se guardara toda la información que esta en el nodo de HTML form y la información que tiene adentro
  const formData = new FormData(form);                                                        // Creamos una nueva instancia del Objeto "FormData" le mandamos un parametro el cual va a ser nuestro formulario que esta guardado en la variable "form", todo eso lo guardamos en la variable "formData"

  console.log(formData.get('file'));                                                          // Mostramos la información que guarda nuestro formulario en la variable "formData" usando de parametro el "file" que es el tipo de contenido, en caso haya seleccionado un archivo como una foto o video, esta variable tendrá la información de dicho archivo 

  const response = await fetch(API_URL_FAVORITES_UPLOAD, {                                    // Guardo en la variable "response" el resultado de un fetch() en donde hago la solicitud para subir el archivo, en este caso una foto a la lista de favoritos, utilizo otra URL con los endpoints indicados para subir la foto
    method: 'POST',
    headers: {
      //'Content-Type': 'multipart/formData',                                                 // No tenemos que mandar el 'Content-Type' en los headers ya que la usar FormData este objeto ya nos agrega la información necesaria de los headers, incluyendo boundary=----
      'X-API-KEY': 'live_n1ykKZKQyBVMv3bkbwcuZGnc9qtZUwneLCROUduvX4m7eJLgUhwetUf1M1HfDadJ',   // La API nos solicita que enviemos nuestra API Key
    }, 
    body: formData,
  })

  const data = await response.json();                                                         // Convertimos la response a formato JSON

  if(response.status !== 201) {                                                               // Si el HTTP nos responde con un codigo distinto al 201 (objeto creado) muestramos el código que nos salio
    spanError.innerHTML = 'Hubo un error: ' + response.status;
  } else {
    console.log('Foto de Perrito Subida :)');
    console.log({data});                                                                      // Imprimo la el objeto completo de mi respuesta en formato JSON
    console.log(data.url);                                                                    // Imprimo la url de mi objeto
    saveFavouritePerrito(data.id);                                                            // Invoco la función para guardar la imagen/archivo que escogí
  }

}


