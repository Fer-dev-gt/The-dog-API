// Defino mi forma personalizada de la función "fetch()"
const myFetch = (url_base, params) => {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    params = params || {};
    const method = "undefined" === typeof params.method ? "get" : params.method;
    const headers = "undefined" === typeof params.headers ? {} : params.headers;
    const data = "undefined" === typeof params.body ? null : params.body;
    xhttp.open(method.toUpperCase(), url_base, true);

    for (const key in headers) {
      xhttp.setRequestHeader(key, headers[key]);
    }

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        if (xhttp.status !== 0) {
          xhttp.json = () => JSON.parse(xhttp.responseText);
          resolve(xhttp);
        } else {
          reject(new Error("Error en myFetch:", url_base));
        }
      }
    };
    xhttp.send(data);
  });
};



// Implementación de "fetch()" y varios llamados, solicitudes para consumir la API
const API_KEY = "tu-api-key"
const API_BASE = "https://api.thedogapi.com/v1";
const API_URL_RANDOM = API_BASE + "/images/search?limit=2";
const API_URL_FAVORITES = API_BASE + "/favourites?api_key=" + API_KEY;
const API_URL_FAVORITES_DELETE = (id) => `${API_BASE}/favourites/${id}`;
const API_URL_UPLOAD = API_BASE + "/images/upload";

const spanError = document.getElementById("error");

async function loadRandomDogs() {
  try {
    const res = await myFetch(API_URL_RANDOM);
    const data = await res.json();

    if (res.status !== 200) {
      spanError.innerHTML = "Hubo un error: " + res.status;
    } else {
      const img1 = document.getElementById("img1");
      const img2 = document.getElementById("img2");

      const btn1 = document.getElementById("btn1");
      const btn2 = document.getElementById("btn2");

      btn1.onclick = () => saveFavoritesDogs(data[0].id);
      btn2.onclick = () => saveFavoritesDogs(data[1].id);

      img1.src = data[0].url;
      img2.src = data[1].url;
    }

  } catch (error) {
    console.log("Error al cargar random", error);
  }
}

async function loadFavoritesDogs() {
  try {
    const res = await myFetch(API_URL_FAVORITES);
    const data = await res.json();
    console.log("loadFavorites", data);
    if (res.status !== 200) {
      spanError.innerHTML = "Hubo un error: " + res.status;
    } else {
      const section = document.getElementById("favoriteDogs");
      section.innerHTML = "";
      const h2 = document.createElement("H2");
      const h2Text = document.createTextNode("Mis Favoritos");
      h2.appendChild(h2Text);
      section.appendChild(h2);
      data.forEach((dog) => {
        console.log(dog);

        const article = document.createElement("article");
        const img = document.createElement("img");
        const btn = document.createElement("button");
        const btnText = document.createTextNode("Quitar de favoritos");

        btn.appendChild(btnText);
        btn.onclick = () => deleteFavoriteDog(dog.id);
        img.src = dog.image.url;
        img.width = 150;
        btn.appendChild(btnText);
        article.appendChild(img);
        article.appendChild(btn);
        section.appendChild(article);
      });
    }
  } catch (error) {
    console.log("Error al cargar favoritos", error);
  }
}

async function saveFavoritesDogs(id) {
  try {
    const res = await myFetch(API_URL_FAVORITES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({
        image_id: id,
      }),
    });
    const data = await res.json();

    if (res.status !== 200) {
      spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
      loadFavoritesDogs();
    }
  } catch (error) {
    console.log("Error al guardar", error);
  }
}

async function deleteFavoriteDog(id) {
  try {
    const res = await myFetch(API_URL_FAVORITES_DELETE(id), {
      method: "DELETE",
      headers: {
        "x-api-key": API_KEY,
      },
    });
    const data = await res.json();

    if (res.status !== 200) {
      spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
      console.log("Perrito eliminado de favoritos");
      loadFavoritesDogs();
    }
  } catch (error) {
    console.log("Error en eliminar de favoritos", error);
  }
}

async function uploadDogPhoto() {
  const form = document.getElementById('uploadingForm');
  const formData = new FormData(form);
  console.log('uploadDogPhoto',formData.get('file'));

  const res = await myFetch(API_URL_UPLOAD,{
    method:'POST',
    headers:{
      //'Content-Type':'multipart/form-data',//con FormData ya no necesita
      'x-api-key':API_KEY
    },
    body: formData
  });
  const data = await res.json();
  if(res.status!==201){
    spanError.innerHTML='Hubo un error: '+res.status+'. '+data.message;
    console.log(data);
  }else{
    console.log('foto subida');
    console.log(data);
    console.log(data.url);
    saveFavoritesDogs(data.id);
    loadFavoritesDogs();
  }
}
loadRandomDogs();
loadFavoritesDogs();