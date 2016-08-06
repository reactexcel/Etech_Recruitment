(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/webpack_json/webpack.config.js                           //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var weight = 500;

function dependencies(settings) {
  return {
    devDependencies: {
      'json-loader' : '^0.5.4'
    }
  };
}

function config() {
  return {
    loaders: [{ test: /\.json$/, loader: 'json' }],
    extensions: ['.json']
  };
}

///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['webpack:json'] = {};

})();

//# sourceMappingURL=webpack_json.js.map
