import http from 'http';
import url from 'url';

let routes = {};

const onRequest = (req, res) => {
  var pathname = url.parse(req.url).pathname;
  console.log(`Request for ${req.method} ${pathname} received`);
  if (typeof(routes[req.method + pathname]) === 'function') {
    routes[req.method + pathname](req, res);
  }
  else {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.end("404 not found");
  }
};

export const forRoute = (method, path, handler) => {
  routes[method + path] = handler;
};

export const start = () => {
  http.createServer(onRequest).listen(9999);
  console.log("Server at port 9999");
};

// export default { forRoute, start };