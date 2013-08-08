Taxi.js - A UI Component Driver
=======

Taxi.js is a client library for displaying UI components in a browser.  Typically, a single
component will be displayed in many states.  It is useful for designers styling components, 
for enumerating examples in a UI library, and for debugging UI components.

## Development

Development is done in a nodejs environment and has several prereqs:

1. install node.  I use [nvm](https://github.com/creationix/nvm)
2. install gruntjs `npm install -g grunt-cli`
3. in the repo, install node modules `npm install`
4. in the repo, execute `grunt`

The default grunt task spawns a watcher handling compilation, live reloading, and starts a 
server on port 8999.  Examples can be viewed at `http://localhost:8999/examples/`.  Tests can
be exectued at `http://localhost:8999/test/`.

## License

[MIT License](http://opensource.org/licenses/MIT)
