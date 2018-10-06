'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Boom = require('boom');
const feed2json = require('feed2json');
const req = require('request');

const getServer = (hapiOptions) => {
  const server = Hapi.server(hapiOptions);

  const getFeed = (url) => {
    return new Promise((resolve, reject) => {
      feed2json.fromStream(req(url), url, { log: false }, (err, json) => {
        if (err) {
          reject(err); return;
        }

        json._feed2json = { url };

        resolve(json);
      });
    })
  };

  server.route({
    method: 'GET',
    path: '/example',
    handler: () => {
      return {
        version: "https://jsonfeed.org/version/1",
        title: "My Example Feed",
        home_page_url: "https://example.org/",
        feed_url: "https://example.org/feed.json",
        items: [
          {
            id: "2",
            content_text: "This is a second item.",
            url: "https://example.org/second-item"
          },
          {
            id: "1",
            content_html: "<p>Hello, world!</p>",
            url: "https://example.org/initial-post"
          }
        ]
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/convert',
    options: {
      validate: {
        query: {
          url: Joi.string().uri().required(),
        }
      },
    },
    handler: async (request) => {
      try {
        return await getFeed(request.query.url);
      } catch (err) {
        if (err.message === 'Not a feed') {
          return Boom.badRequest('The supplied url does not appear to be a valid rss feed.');
        } else {
          throw err;
        }
      }
    }
  });

  return server;
};

module.exports = (hapiOptions) => getServer(hapiOptions);
