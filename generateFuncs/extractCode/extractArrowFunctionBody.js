export function extractArrowFunctionBody(scriptContent, functionName) {
  let body = '';
  let depth = 0;
  let insideFunction = false;

  const functionRegex = new RegExp(
    `(?:export\\s+)?((async)\\s+)?(?:const|let|var)\\s+${functionName}\\s*=\\s*((async)\\s+)?\\s*\\(([^)]*)\\)\\s*=>`,
    'ms'
  );

  const functionMatch = scriptContent.match(functionRegex);
  if (!functionMatch) return body;

  // Если async присутствует либо до объявления, либо после знака "="
  const isAsync = Boolean(functionMatch[1] || functionMatch[3]);
  const functionArgs = functionMatch[5] ? functionMatch[5].trim() : '';

  // Вычисляем начало определения тела функции после найденного шаблона
  const functionStartIndex = scriptContent.indexOf(functionMatch[0]) + functionMatch[0].length;

  for (let i = functionStartIndex; i < scriptContent.length; i++) {
    let char = scriptContent[i];

    // Если найден символ начала блока и мы ещё не начали собирать тело
    if (char === '{' && depth === 0) {
      insideFunction = true;
    }

    if (insideFunction) {
      body += char;
      if (char === '{') {
        depth++;
      } else if (char === '}') {
        depth--;
        if (depth === 0) {
          break;
        }
      }
    }
  }

  // Возвращаем корректное объявление функции с включением async, если нужно
  return `${isAsync ? 'async ' : ''}const ${functionName} = (${functionArgs}) => ${body}`;
}
