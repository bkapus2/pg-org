export default function printFilePath(filename) {
  return filename.replace(/.+src[\\/]/, '').replace('.spec.js', '');
}