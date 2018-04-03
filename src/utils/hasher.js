const allStringChars = [];
for (let i = 32; i < 126; i++) {
  allStringChars.push(String.fromCharCode(i))
}

export default function hasher(options={}) {
  const { omit = [] } = options;
  const hashMap = new Map();
  const hashValues = omit.length
    ? allStringChars.filter(str => !omit.includes(str))
    : allStringChars.slice();
  const hvLen = hashValues.length;

  function getNext(index) {
    const remainder = index % hvLen;
    const power = ~~(index / hvLen); // ~~ is faster than Math.floor
    if (power > 0) {
      return getNext(power-1) + hashValues[remainder];
    } else {
      return hashValues[remainder];
    }
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