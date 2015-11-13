this["taxi"] = this["taxi"] || {};
this["taxi"]["templates"] = this["taxi"]["templates"] || {};

this["taxi"]["templates"]["driver"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<ul class="taxi-driver-runners"></ul>\n';

}
return __p
};

this["taxi"]["templates"]["driver_list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ul>\n  ';
 _.each(obj, function (driver) { ;
__p += '\n  <li><a href="#driver/' +
__e( driver.key ) +
'">' +
__e( driver.name ) +
'</a></li>\n  ';
 }); ;
__p += '\n</ul>\n';

}
return __p
};

this["taxi"]["templates"]["runner"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="taxi-runner" data-key="' +
__e( runner.key ) +
'">\n  <div class="taxi-runner-name">\n    <a href="#driver/' +
__e( driver_key ) +
'/' +
__e( runner.key ) +
'">' +
__e( runner.name ) +
'</a>\n  </div>\n  <div class="taxi-runner-container"></div>\n</li>\n';

}
return __p
};

this["taxi"]["templates"]["taxi"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="taxi-header">\n  <h1>Taxi.js - <span class="taxi-title"></span></h1>\n  <div class="taxi-menu">\n    <a href="#">menu</a>\n  </div>\n</div>\n<div class="taxi-view"></div>\n';

}
return __p
};