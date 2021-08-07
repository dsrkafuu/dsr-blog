Array.prototype.unique = function () {
  const arr = this;
  return arr.filter((val, idx) => arr.indexOf(val) === idx);
};
