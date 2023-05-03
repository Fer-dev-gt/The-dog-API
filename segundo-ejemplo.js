// Forma de guardar todos los objetos HTML <img> en un Array usando un forEach
const btn = document.querySelector('button');

async function callUrls() {
    const catUrlApi = "https://api.thecatapi.com/v1/images/search?limit=3";

    const response = await fetch(catUrlApi);
    const data = await response.json();
    const images = document.getElementsByTagName("img"); 

    const arrImages = [...images];
    arrImages.forEach((image, item) => {
        image.src = data[item].url;
    });
}

btn.addEventListener("click", callUrls);
window.onload = callUrls();