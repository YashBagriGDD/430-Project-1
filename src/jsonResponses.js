// Local memory for the card stack
const cards = {};

//function to respond with a json object
//takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

//function to respond without json body
//takes request, response and status code
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

//return user object as JSON
const getData = (request, response) => {
  const responseJSON = {
    cards,
  };

  respondJSON(request, response, 200, responseJSON);
};

//function to add a user from a POST body
const addData = (request, response, body) => {
  //default json message
  const responseJSON = {
    message: 'Title, description, classification, and image are required.',
  };

  if (!body.title || !body.desc || !body.subject || !body.image) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  //default status code to 201 created
  let responseCode = 201;

  //if that user's name already exists in our object
  //then switch to a 204 updated status
  if (cards[body.title]) {
    responseCode = 204;
  } else {
    cards[body.title] = {};
  }

  //add or update fields for this user name
  cards[body.title].title = body.title;
  cards[body.title].desc = body.desc;
  cards[body.title].subject = body.subject;
  cards[body.title].image = body.image;

  //if response is created, then set our created message
  //and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

//Handles the 404 not found response
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

//public exports
module.exports = {
  getData,
  addData,
  notFound,
};