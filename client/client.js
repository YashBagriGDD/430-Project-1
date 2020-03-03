//function to parse our response
const parseJSON = (xhr, content) => {
    //parse response (obj will be empty in a 204 updated)
    const obj = JSON.parse(xhr.response);
    
    //if message in response, add to screen
    if(obj.message) {
      const p = document.getElementById("status");
      p.innerHTML = `<p>${obj.message}<p>`;
    }
    
    //if cards in response, add to screen
    if(obj.cards) {
      const filter = document.querySelector("#filterField");
      for (let c in obj.cards) {
        if (!filter.value || obj.cards[c].subject === filter.value) {
          const cardList = document.createElement('div');
          let cardContent = `<div class="notecard"><div class="front"><h1 class="title">${obj.cards[c].title}</h1><p class="desc">${obj.cards[c].desc}</p><p class="subject">${obj.cards[c].subject}</p></div><div class="back"><img src="${obj.cards[c].image}"></div></div>`;
          cardList.innerHTML += cardContent;
          content.appendChild(cardList);
        }
      }
    }
  };

  //function to handle our response
  const handleResponse = (xhr) => {
    const content = document.querySelector('#content');
    
    //check the status code
    switch(xhr.status) {
      case 200: //success
        content.innerHTML = `<div id="status" class="alert alert-success" role="alert">Success</div>`;
        break;
      case 201: //created
        content.innerHTML = '<div id="status" class="alert alert-success" role="alert">Create</div>';
        break;
      case 204: //updated (no response back from server)
        content.innerHTML = '<div id="status" class="alert alert-secondary" role="alert">Updated (No Content)</div>';
        return;
      case 400: //bad request
        content.innerHTML = `<div id="status" class="alert alert-danger" role="alert">Bad Request</div>`;
        break;
      case 401: //unauthorized
        content.innerHTML = `<div id="status" class="alert alert-danger" role="alert">Unauthorized to access this.</div>`
        break;
      case 503: //Service unavailable
        content.innerHTML = `<div id="status" class="alert alert-danger" role="alert">Service Unavailable</div>`;
        break;
      default: //any other status code
        content.innerHTML = `<div id="status" class="alert alert-danger" role="alert">Error code not implemented by client.</div>`;
        break;
    }

    //parse response 
    parseJSON(xhr, content);
  };

  //function to send our post request
  const sendPost = (e, dataField) => {
    //prevent the browser's default action (to send the form on its own)
    e.preventDefault();
    
    //grab the forms action (url to go to)
    //and method (HTTP method - POST in this case)
    const nameAction = dataField.getAttribute('action');
    const nameMethod = dataField.getAttribute('method');
    
    //grab the form's name and age fields so we can check user input
    const titleField = dataField.querySelector('#titleField');
    const descField = dataField.querySelector('#descField');
    const subjectField = dataField.querySelector('#subjectField');
    const imageField = dataField.querySelector('#imageField');
    
    //create a new Ajax request (remember this is asynchronous)
    const xhr = new XMLHttpRequest();
    //set the method (POST) and url (action field from form)
    xhr.open(nameMethod, nameAction);
    
    //set our request type to x-www-form-urlencoded
    //which is one of the common types of form data. 
    //This type has the same format as query strings key=value&key2=value2
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //set our requested response type in hopes of a JSON response
    xhr.setRequestHeader ('Accept', 'application/json');
    
    //set our function to handle the response
    xhr.onload = () => handleResponse(xhr);
    
    //build our x-www-form-urlencoded format. Without ajax the 
    //browser would do this automatically but it forcefully changes pages
    //which we don't want.
    //The format is the same as query strings, so key=value&key2=value2
    //The 'name' fields from the inputs are the variable names sent to
    //the server. 
    //So ours might look like  name=test&age=22
    //Again the 'name' fields in the form are the variable names in the string
    //and the variable names the server will look for.
    const formData = `title=${titleField.value}&desc=${descField.value}&subject=${subjectField.value}&image=${imageField.value}`;
    
    //send our request with the data
    xhr.send(formData);
  
    //return false to prevent the browser from trying to change page
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
    const userForm = document.querySelector('#userForm');
    
    //create handler
    const addData = (e) => sendPost(e, dataField);
    const getData = (e) => requestUpdate(e, userForm);
    
    //attach submit event (for clicking submit or hitting enter)
    dataField.addEventListener('submit', addData);
    userForm.addEventListener('submit', getData);

    // Sidebar work
    document.querySelector('#sidebarCollapse').onclick = e => {
      if(document.getElementById('sidebar').classList.contains("active")){
        document.getElementById('sidebar').classList.remove("active");
      } else {
        document.getElementById('sidebar').classList.add("active");
      }
    }
  };

  window.onload = init;