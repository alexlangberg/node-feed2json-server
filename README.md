# node-feed2json-server

Simple server for a feed2json service.

## Installation
```
npm install -g feed2json-server
```

## Start
```
feed2json-server
```

The service can be started anywhere as it requires no local files of any kind and simply acts as a proxy on port 4201.

Options might come later but it's also rather easy to simply hack the port number in the file in the bin folder.


## Examples

With the server running, you can call these URLs:

http://localhost:4201/example - an example of jsonfeed

http://localhost:4201/convert?url=http://feeds.bbci.co.uk/news/rss.xml
