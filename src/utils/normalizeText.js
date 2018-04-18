export default function normalizeText(text) {
  return text.replace(/[\n\t\r]/,' ').replace(/\s+/g,' ').trim();
}