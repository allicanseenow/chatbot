var http = require('http');
var url = require('url');

let route = {
  routes: {},
  for: (path, handler) => {
    this.routes[path] = handler;
  },
};

route.for("/start", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("Hello");
  res.end();
});

route.for("/finish", (request, response) => {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Goodbye");
  response.end();
});

function onRequest(request, response) {
  let pathname = url.parse(request.url).pathname;
  console.log("Request for " + pathname + " received.");
  if (typeof route.routes[pathname] ==='function') {
    route.routes[pathname](request, response);
  }
  else {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.end("404 Not Found");
  }
}

http.createServer(onRequest).listen(9999);
console.log("Server has started.");