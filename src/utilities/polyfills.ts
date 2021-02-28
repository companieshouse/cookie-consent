/* eslint-disable */
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';

    if (search as any instanceof RegExp) {
      throw TypeError('first argument must not be a RegExp');
    }
    if (start === undefined) { start = 0; }
    return this.indexOf(search, start) !== -1;
  };
}