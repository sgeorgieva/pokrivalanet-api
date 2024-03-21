module.exports = iterateEntries = (node, fn) => {
  const newNode = {};
  Object.entries(node).forEach(([key, val]) => (newNode[key] = fn(val)));

  return newNode;
}