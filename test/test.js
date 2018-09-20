'use strict';

const http = require('http');
const req = require('request');
const test = require('tape');
const fs = require('fs');
const feed2jsonServer = require('../lib');

const feedServer = feed2jsonServer({
  port: 4201,
  host: 'localhost'
});

let server;

test('setup', (t) => {
  server = http.createServer((request, response) => {
    if (request.url === '/rss') {
      response.writeHead(200, {'Content-Type': 'application/rss+xml'});
      response.end(fs.readFileSync('./test/rss-sample.xml'));
    }
  }).listen(1337);

  server.on('listening', () => feedServer.start().then(t.end()));
});

test('it should set up an rss test server', (t) => {
  t.plan(1);

  req('http://localhost:1337/rss', (error, response) => {
    t.equal(200, response.statusCode);
  })
});

test('it should get and convert an rss feed', (t) => {
  t.plan(2);
  const url = 'http://localhost:4201/convert?url=http://localhost:1337/rss';

  req(url, (error, response, body) => {
    t.equal(200, response.statusCode);

    const json = JSON.parse(body);
    t.equal("RSS Title", json.title);
  })
});

test('teardown', (t) => {
  feedServer.stop().then(() => {
    server.close();
    t.end();
  });
});
