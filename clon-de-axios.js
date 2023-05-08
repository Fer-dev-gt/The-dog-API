const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const API_URL_PRODUCTS = 'https://api.escuelajs.co/api/v1/products';

// Using XMLHttpRequest to clone Axios using "clases"
class customFetch {
  constructor() {
    this.methods = {
      get: 'GET',
      post: 'POST',
      put: 'PUT',
      delete: 'DELETE'
    }
  }                                                                   // Instancing the prototype with its methods to access them when it's needed during the requests
  get({
    API,
    id = null,
    params = null,
    addition = null,
  }){
    this.#call({
      API, id, params, addition, method: this.methods.get
    })                                                                // Calling private method to make xhttpwith its corresponding HTTP method
  }
  put({
    API,
    id = null,
    params = null,
    addition = null,
  }){
    this.#call({
      API, id, params, addition, method: this.methods.post
    }) 
  }
  del({
    API,
    id = null,
    params = null,
    addition = null,
  }){
    this.#call({
      API, id, params, addition, method: this.methods.delete
    }) 
  }
  #call({
    API,
    id = null,
    params = null,
    addition = null, 
    method = null,
  }){
    const xhttp = new XMLHttpRequest();                               // Creating XMLHttpRequest instance
    let newApi = API;                                                 // Storing API as a variable to concat it with another variable
    if(addition) {
      let newApi = `${API}/ + ${id}`                                  // newApi will be the sum of both variables
    }

    xhttp.open(method, newApi, true);                                 // Opening the asynchronous communication with the newApi variable and the method pointed in the call of '#call' method
    xhttp.setRequestHeader('Content-Type', 'application/json');       // Sending headers
    xhttp.onreadystatechange = (ev) => {
      if(xhttp.readyState === 4) {
        if(xhttp.status === 200) {
          const response = JSON.parse(xhttp.responseText);
          console.log(response);                                      // Parsing and recieving in console result of xhttp request
        } else {
          console.error(ev);
        }
      }
    }
    let stringfied = JSON.stringify(params);                          // Converting into a string the body of the request
    xhttp.send(stringfied);                                           // Sending the body
  }
}


// Now that we have the Class, we have to instance an apply its methods

const custom = new customFetch();                                     // Instancing Class
custom.get({API: API_URL_PRODUCTS});                                  // Getting the list of all Products

custom.put({                                                          // Updating the product
  API: API_URL_PRODUCTS,
  id: 62,
  params: {
    "title": "Change title",
    "price": 100
  },
})

custom.pos({                                                            // Creating a product
  API: API_URL_PRODUCTS,
  params: {
    "title": "New Product",
    "price": 10,
    "description": "A description",
    "categoryId": 1,
    "images": ["https://anyImage.com"]
  }
})
custom.del({                                                            // Deleting a product
  API: API_URL_PRODUCTS,
  id: 62,
  addition: 62
})