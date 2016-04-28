Modular code
===================
Here you will learn how to manage dependencies between JavaScript files and libraries. For this book I'm using Browserify to do that, but other tools exists for the same porpuses: webpack, require.js, systemjs, etc.

Insted of write script tags in the html file, you will be able to install libraries from the command line and load them with a simple require call.

Setup and run
---
Remember that you will need to have a node version 5.2 or superior. Install the project dependencies.

    $ npm install

To run the project is as easy as call the `start` script.

    $ npm start

The project includes a linter ([eslint](http://eslint.org/)) to statically check the source code. You can run the linter with the `lint` script.

    $ npm run lint

Bundled code
---
Code for this capter should be bundled before run the project. This process looks for the dependencies in your files and puts them in a single file.

    $ npm run bundle

The command above will run the bundled proces for you. Just keep this in mind. The command above will be run automatically for you when you run the start command.
