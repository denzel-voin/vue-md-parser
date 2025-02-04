export function wrapText(text, maxLength = 50) {
  return text.replace(new RegExp(`(.{1,${maxLength}})(\\s|$)`, 'g'), '$1<br>');
}
