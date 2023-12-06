const getId = function generateUid() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 20);
  return timestamp + randomPart;
};

export default getId;
