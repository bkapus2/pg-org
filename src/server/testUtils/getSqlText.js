import fs from 'fs';

export default function getSqlText(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile('src/server/testScripts/' + filename, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result.toString());
    });
  });
}