"use strict;"

// The port to serve on
const PORT = 3000;

// global variables
var fs = require('fs');
var http = require('http');
var server = new http.Server(handleRequest);

// Start the server
server.listen(PORT, function() {
  console.log("Listening on port", PORT);
});

/** @function serveFile
 * Serves a static file resource
 * @param {string} file - the path to the file
 * @param {string} type - the Content-Type of the file
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 */
function serveFile(file, type, req, res) {
  fs.readFile(file, function(err, data) {
    if(err) {
      console.error("error");
      res.statusCode = 500;
      res.end("Server Error");
      return;
    }
    res.setHeader('ContentType', type);
    res.end(data);
  });
}

/** @function handleRequest
 * Handles incoming http requests
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 */
function handleRequest(req, res) {
  switch(req.url) {
    // Serving static files
    case '/':
    case '/index.html':
      serveFile('public/index.html', 'text/html', req, res);
      break;
    case '/style.css':
      serveFile('public/style.css', 'text/css', req, res);
      break;
    case '/script.js':
      serveFile('public/script.js', 'text/css', req, res);
      break;
    // Serve worker scripts
    case '/permutations.js':
      serveFile('public/permutations.js', 'text/javascript', req, res);
      break;
      case '/grayscale.js':
        serveFile('public/grayscale.js', 'text/javascript', req, res);
        break;
    // Serving image files
    case '/images/ace.jpg':
      serveFile('images/ace.jpg', 'image/jpeg', req, res);
      break;
    case '/images/bubble.jpg':
      serveFile('images/bubble.jpg', 'image/jpeg', req, res);
      break;
    case '/images/chess.jpg':
      serveFile('images/chess.jpg', 'image/jpeg', req, res);
      break;
    case '/images/fern.jpg':
      serveFile('images/fern.jpg', 'image/jpeg', req, res);
      break;
    case '/images/mobile.jpg':
      serveFile('images/mobile.jpg', 'image/jpeg', req, res);
      break;
    // Serve error code
    default:
      res.statusCode = 404;
      res.end("Not found");
  }
}
