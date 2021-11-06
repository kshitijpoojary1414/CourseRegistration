"use strict";

const is = require("is");
const has = require("lodash/has");

const validations = {
  isUndefined: value => is.undef(value),
  isDefined: value => is.defined(value),
  isObject: value => is.object(value),
  isEmpty: value => is.empty(value),
  isValidObject: value => is.object(value) && !is.empty(value),
  isNull: value => is.nil(value),
  isString: value => is.string(value),
  isEmptyString: value => is.string(value) && value.length === 0,
  isFn: value => is.fn(value),
  isBool: value => is.bool(value),
  isNumber: value => is.number(value),
  isArray: value => is.array(value),
  isEmptyArray: value => is.array(value) && is.array.empty(value),
};

validations.has = (object, key) => has(object, key);

exports.Validations = validations;
