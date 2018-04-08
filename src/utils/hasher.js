const allStringChars = [];
for (let i = 32; i < 126; i++) {
  allStringChars.push(String.fromCharCode(i));
}

export default function hasher(options={}) {
  const { omit = [] } = options;
  const hashMap = new Map();
  const hashValues = omit.length
    ? allStringChars.filter(str => !omit.includes(str))
    : allStringChars.slice();
  const hvLen = hashValues.length;

  function getNext(index) {
    let remainder = 0;
    let power = index;
    let hash = '';
    do {
      remainder = power % hvLen;
      power = ~~(power / hvLen); // ~~ is faster than Math.floor
      hash = hashValues[remainder] + hash;
    } while (power > 0);
    return hash;
  }

  function getHashValue(key) {
    const value = hashMap.get(key);
    if (value) {
      return value;
    } else {
      const value = getNext(hashMap.size);
      hashMap.set(key, value);
      return value;
    }
  }

  return getHashValue;
}