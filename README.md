# summernote-imagehandler

This is a node module that will take the code given by summernote and locate any <img> elements that may have a base64 image as its "src" attribute.

# Usage

The general usage for this module would be to save base64 images to an accessible area and replace them with links to these saved images instead of saving image data directly to databases resulting in large data. An example of usage can be found in the [test module](test/test.js).

# Testing

There is a test module available using [mocha](https://www.npmjs.com/package/mocha) and [chai](https://www.npmjs.com/package/chai) and can be run with the following command:

    npm test
