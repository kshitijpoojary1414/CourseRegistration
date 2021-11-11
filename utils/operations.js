/* eslint-disable camelcase */
"use strict";
const {v4 : uuidv4} = require("uuid");
const IdGenerator = require("auth0-id-generator");
const _intersection = require("lodash/intersection");

const InvoiceIdGenerator = new IdGenerator({
  prefix: ["inv"],
  separator: "_",
  // len: 10,
  // alphabet: "0123456789",
});

const TransactionIdGenerator = new IdGenerator({
  prefix: ["txn"],
  separator: "_",
  // len: 10,
  // alphabet: "0123456789",
});

function toLowerCase(string = "") {
  return string.toLowerCase();
}

function toLowercase(string = "") {
  return string.toLowerCase();
}

function trim(string = "") {
  return string.trim();
}

function trimAll(string = "") {
  return string.replace(/\s+/g, "");
}

function replaceAll(string = "", pattern = "", replace = "") {
  return string.replace(new RegExp(pattern, "g"), replace);
}

function toPositive(number = "") {
  return Math.abs(number);
}

function insertAt(array = [], index, item) {
  array.splice(index, 0, item);
  return array;
};

function normalize(array, key) {
  return array.reduce(
    (collector, item) => {
      collector[item[key]] = item;
      return collector;
    }
  , {});
}

function removeArrayIndex(array, index) {
  const clonedArray = JSON.parse(JSON.stringify(array));
  clonedArray.splice(index, 1);
  return clonedArray;
}

function guid() {
  return uuidv4();
}

function formatCurrency(currency = "USD", amount = 0) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch (error) {
    return amount;
  }
}

function intersection(array1 = [], array2 = []) {
  return _intersection(array1, array2);
}

/* Helper buddy for removing async/await try/catch litter */
function safeAwait(promise, finallyFunc) {
  return promise.then(data => {
    if (data instanceof Error) {
      return [data];
    }
    return [undefined, data];
  }).catch(error => {
    return [error];
  }).finally(() => {
    if (finallyFunc && typeof finallyFunc === "function") {
      finallyFunc();
    }
  });
}

function parseSqsMessage(message) {
  try {
    const { Body } = message || {};
    const SqsBody = JSON.parse(Body);

    return {
      MessageId: SqsBody.MessageId,
      Message: SqsBody,
    };
  } catch (error) {
    throw error;
  }
}

function generateInvoiceId() {
  return InvoiceIdGenerator.get();
}

function generateTransactionId() {
  return TransactionIdGenerator.get();
}

function deepCloneObject(obj) {
  const newObjString = JSON.stringify(obj);
  const newObj = JSON.parse(newObjString);
  return newObj;
}
const Operations = {
  toLowerCase,
  toLowercase,
  trim,
  trimAll,
  replaceAll,
  insertAt,
  normalize,
  toPositive,
  guid,
  removeArrayIndex,
  formatCurrency,
  intersection,
  safeAwait,
  parseSqsMessage,
  generateInvoiceId,
  deepCloneObject,
  generateTransactionId,
};

exports.Operations = Operations;
