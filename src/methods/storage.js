'use strict';

let storage = window.sessionStorage;

let updateStorage = (key, data) => {
  storage.setItem(key, data);
};

let getStorage = (key) => {
  return storage[key];
};

let accountCache = getStorage('account');
accountCache = accountCache ? JSON.parse(accountCache) : {};
accountCache.uid = accountCache.uid || '';

exports.getAccount = () => {
    return accountCache;
};

exports.removeAccount = () => {
    accountCache = {};
    storage.removeItem('account');
}; //但是这个好像没什么用……

 exports.getStorageObject = (key) => {
  let storage = getStorage(key);
  if (storage) {
    return JSON.parse(storage);
  } else {
    return {};
  }
};

exports.updateAccount = (key, value) => {
  accountCache[key] = value;
  updateStorage('account', JSON.stringify(accountCache));
};

exports.cloneObjData = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
