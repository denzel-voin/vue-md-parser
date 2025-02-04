// Функция для извлечения тела обычной функции с использованием стека
export function extractFunctionBody(scriptContent, functionName) {
  let body = '';
  let depth = 0;
  let startIndex = scriptContent.indexOf(functionName);
  if (startIndex === -1) return body;

  let insideFunction = false;
  let functionArgs = '';

  // Извлекаем сигнатуру функции (аргументы)
  const functionSignatureMatch = scriptContent.match(new RegExp(`function\\s+${functionName}\\s*\\(([^)]*)\\)`));
  if (functionSignatureMatch) {
    functionArgs = functionSignatureMatch[1].trim();
  }

  // Поиск тела функции с использованием стека
  for (let i = startIndex; i < scriptContent.length; i++) {
    let char = scriptContent[i];

    // Начало функции
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

  // Возвращаем название функции с аргументами и телом
  return `function ${functionName}(${functionArgs}) ${body}`;
}
