module.exports = iterateEntries = (node, fn) => {
  const newNode = {};
  Object.entries(node).forEach(([key, val]) => {
    if (key !== 'id') {
      return newNode[key] = fn(val);
    }
  });

  return newNode;
}