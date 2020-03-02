//function to parse our response
const parseJSON = (xhr, content) => {
  //parse response (obj will be empty in a 204 updated)
  const obj = JSON.parse(xhr.response);
  console.dir(obj); //if message in response, add to screen

  if (obj.message) {
    const p = document.createElement('p');
    p.textContent = `Message: ${obj.message}`;
    content.appendChild(p);
  } //if cards in response, add to screen


  if (obj.cards) {
    const filter = document.querySelector("#filterField");

    for (let c in obj.cards) {
      if (!filter.value || obj.cards[c].subject === filter.value) {
        const cardList = document.createElement('div'); // let cardContent = `Title: <b>${obj.cards[c].title}</b> Description: <b>${obj.cards[c].desc}</b> Subject: <b>${obj.cards[c].subject}</b> Image: <img src="${obj.cards[c].image}">`;
        // let cardContent = `
        //   <div class="notecard">
        //     <div class="front">
        //       <h4>${obj.cards[c].title}</h4>
        //       <p>${obj.cards[c].desc}</p>
        //       <p>${obj.cards[c].subject}</p>
        //     </div>
        //     <div class="back">
        //       <img src="${obj.cards[c].image}">
        //     </div>
        //   </div>
        // `;

        let cardContent = `<div class="notecard"><div class="front"><h1>${obj.cards[c].title}</h1><p>${obj.cards[c].desc}</p><p>${obj.cards[c].subject}</p></div><div class="back"><img src="${obj.cards[c].image}"></div></div>`;
        cardList.innerHTML += cardContent;
        content.appendChild(cardList);
      }
    }
  }
}; //function to handle our response


const handleResponse = xhr => {
  const content = document.querySelector('#content'); //check the status code

  switch (xhr.status) {
    case 200:
      //success
      content.innerHTML = `<b>Success</b>`;
      break;

    case 201:
      //created
      content.innerHTML = '<b>Create</b>';
      break;

    case 204:
      //updated (no response back from server)
      content.innerHTML = '<b>Updated (No Content)</b>';
      return;

    case 400:
      //bad request
      content.innerHTML = `<b>Bad Request</b>`;
      break;

    case 401:
      //unauthorized
      content.innerHTML = `<b>Unauthorized to access this.</b>`;
      break;

    case 503:
      //Service unavailable
      content.innerHTML = `Service Unavailable`;
      break;

    default:
      //any other status code
      content.innerHTML = `Error code not implemented by client.`;
      break;
  } //parse response 


  parseJSON(xhr, content);
}; //function to send our post request


const sendPost = (e, dataField) => {
  //prevent the browser's default action (to send the form on its own)
  e.preventDefault(); //grab the forms action (url to go to)
  //and method (HTTP method - POST in this case)

  const nameAction = dataField.getAttribute('action');
  const nameMethod = dataField.getAttribute('method'); //grab the form's name and age fields so we can check user input

  const titleField = dataField.querySelector('#titleField');
  const descField = dataField.querySelector('#descField');
  const subjectField = dataField.querySelector('#subjectField');
  const imageField = dataField.querySelector('#imageField'); //create a new Ajax request (remember this is asynchronous)

  const xhr = new XMLHttpRequest(); //set the method (POST) and url (action field from form)

  xhr.open(nameMethod, nameAction); //set our request type to x-www-form-urlencoded
  //which is one of the common types of form data. 
  //This type has the same format as query strings key=value&key2=value2

  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); //set our requested response type in hopes of a JSON response

  xhr.setRequestHeader('Accept', 'application/json'); //set our function to handle the response

  xhr.onload = () => handleResponse(xhr); //build our x-www-form-urlencoded format. Without ajax the 
  //browser would do this automatically but it forcefully changes pages
  //which we don't want.
  //The format is the same as query strings, so key=value&key2=value2
  //The 'name' fields from the inputs are the variable names sent to
  //the server. 
  //So ours might look like  name=test&age=22
  //Again the 'name' fields in the form are the variable names in the string
  //and the variable names the server will look for.


  const formData = `title=${titleField.value}&desc=${descField.value}&subject=${subjectField.value}&image=${imageField.value}`; //send our request with the data

  xhr.send(formData); //return false to prevent the browser from trying to change page

  return false;
};

const requestUpdate = (e, userForm) => {
  const url = '/getData';
  e.preventDefault();
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => handleResponse(xhr);

  xhr.send();
  return false; //html bubbling, stops all events
};

const init = () => {
  //grab form
  const dataField = document.querySelector('#dataField');
  const userForm = document.querySelector('#userForm'); //create handler

  const addData = e => sendPost(e, dataField);

  const getData = e => requestUpdate(e, userForm); //attach submit event (for clicking submit or hitting enter)


  dataField.addEventListener('submit', addData);
  userForm.addEventListener('submit', getData);
};

window.onload = init;
