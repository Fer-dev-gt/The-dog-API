const API_URL_PRODUCTS = 'https://api.escuelajs.co/api/v1/products';

function customFetch(API) {                                         // Creo mi propio fetch al usar "new XMLHttpRequest", "new Request" y "new Headers"
  const xhttp = new XMLHttpRequest();
  const request = new Request(API, init = {});
  const headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('cors', 'no-cors');
  headers.append('credentials', 'omit');

  xhttp.open(request.method, API, true)

  xhttp.onreadystatechange = (e) => {
    if(xhttp.readyState === 4 && xhttp.status === 200){
      const response = JSON.parse(xhttp.responseText);
      console.log(response);
    } else {
      console.error(e);
    }
  }
  xhttp.send();
}