const feed2jsonServer = require('./lib/index.js');

const server = feed2jsonServer({
  port: 4201,
  host: 'localhost'
});

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
