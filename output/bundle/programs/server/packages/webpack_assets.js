(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

(function(){

//////////////////////////////////////////////////////////////////////////
//                                                                      //
// packages/webpack_assets/webpack.config.js                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////
                                                                        //
var weight = 999;

function dependencies() {
  return {
    devDependencies: {
      'url-loader': '^0.5.7',
      'file-loader': '^0.8.5'
    }
  };
}

function config(settings) {
  var ext = 'svg|ttf|woff2?|eot';

  if (settings.assets && settings.assets.extensions) {
    ext += '|' + settings.assets.extensions.join('|');
  }

  return {
    loaders: [
      { test: /\.(png|jpe?g)(\?.*)?$/, loader: 'url?limit=' + ((settings.assets && settings.assets.limit) ? settings.assets.limit : 8182) },
      { test: new RegExp('\\.(' + ext + ')(\\?.*)?$'), loader: 'file' }
    ]
  };
}

//////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['webpack:assets'] = {};

})();

//# sourceMappingURL=webpack_assets.js.map
