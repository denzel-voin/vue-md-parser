export function extractFullBlock(scriptContent, startPos) {
  let pos = startPos;
  const length = scriptContent.length;

  // Пропускаем пробельные символы
  while (pos < length && /\s/.test(scriptContent[pos])) {
    pos++;
  }

  // Если сначала идёт открывающая круглая скобка, пропускаем её до закрывающей.
  if (scriptContent[pos] === '(') {
    let parenCount = 0;
    while (pos < length) {
      if (scriptContent[pos] === '(') {
        parenCount++;
      } else if (scriptContent[pos] === ')') {
        parenCount--;
        if (parenCount === 0) {
          pos++; // пропускаем закрывающую скобку
          break;
        }
      }
      pos++;
    }
  }

  // Пропускаем пробелы после круглых скобок (если они были)
  while (pos < length && /\s/.test(scriptContent[pos])) {
    pos++;
  }

  // Определяем символ, с которого начинается блок: может быть объект ({) или массив ([)
  const openChar = scriptContent[pos];
  let closeChar;
  if (openChar === '{') {
    closeChar = '}';
  } else if (openChar === '[') {
    closeChar = ']';
  } else {
    // Если не найден ожидаемый открывающий символ – возвращаем пустую строку
    return '';
  }

  const blockStart = pos;
  let openCount = 0;
  let blockEnd = -1;
  for (; pos < length; pos++) {
    if (scriptContent[pos] === openChar) {
      openCount++;
    } else if (scriptContent[pos] === closeChar) {
      openCount--;
      if (openCount === 0) {
        blockEnd = pos;
        break;
      }
    }
  }

  if (blockEnd !== -1) {
    // Возвращаем участок от открывающей до закрывающей скобки (включительно)
    return scriptContent.slice(blockStart, blockEnd + 1);
  }
  return '';
}
