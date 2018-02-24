import { forRoute, start } from './server';

forRoute('GET', '/start', (req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("Hello");
  res.end();
});

forRoute('GET', '/finish', (req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("Goodbye");
  res.end();
});

forRoute('POST', '/echo', (req, res) => {
  let incoming = '';

  req.on('data', (chunk) => {
    incoming += chunk.toString();
  });

  req.on('end', () => {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write(incoming);
    res.end();
  });
});

forRoute('GET', '/echo', (req, res) => {
  let body = '<html>' +
    '<head><title>Node.js Echo</title></head>' +
    '<body>' +
    '<form method="POST">' +
    '<input type="text" name="msg"/>' +
    '<input type="submit" value="echo"/>' +
    '</form>' +
    '</body></html>';
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write(body);
  res.end();
});

start();
