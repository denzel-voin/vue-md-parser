// Функция для извлечения тела computed функции с использованием стека
export function extractComputedBody(scriptContent, functionName) {
  let body = '';
  let startIndex = scriptContent.indexOf(functionName);

  if (startIndex === -1) {
    return body;
  }

  // Обновляем регулярное выражение для поиска вычисляемой функции
  const computedPattern = /computed\s*\(\s*(?:function\s*\(\s*)?([^)]*)\)\s*=>\s*\{[\s\S]*?\}/g;
  const computedMatch = scriptContent.slice(startIndex).match(computedPattern);

  if (!computedMatch) {
    return body;
  }

  // Теперь извлекаем тело функции
  let functionContent = computedMatch[0];

  // Ищем начало и конец тела функции
  let functionStartIndex = functionContent.indexOf('{') + 1;
  let functionEndIndex = functionContent.lastIndexOf('}');

  body = functionContent.slice(functionStartIndex, functionEndIndex).trim();

  // Возвращаем корректный формат
  return body ? `const ${functionName} = computed(() => {\n      ${body}\n});` : '';
}
