export function extractVariableCode(scriptContent, variableName, startPosition = 0) {
  let body = '';
  let startIndex = scriptContent.indexOf(variableName, startPosition); // ищем, начиная с указанной позиции

  if (startIndex === -1) {
    return body;
  }

  const variablePattern = new RegExp(
    `(?:\\b(const|let|var)\\s+)?(${variableName})\\s*=\\s*([^;\\n]+)`,
    'm'
  );

  const scriptSlice = scriptContent.slice(startIndex - 100, startIndex + 300);
  const variableMatch = scriptSlice.match(variablePattern);

  if (variableMatch) {
    const value = variableMatch[3].trim();
    // Исключаем стрелочные и асинхронные функции
    if (
      !/^\(\s*\)\s*=>/.test(value) &&   // Стрелочная функция без параметров
      !/^\w+\s*\(\s*\)\s*=>/.test(value) && // Стрелочная функция с параметрами
      !/^async\s*\(\s*\)\s*=>/.test(value) // Асинхронная стрелочная функция
    ) {
      const keyword = variableMatch[1] ? `${variableMatch[1]} ` : '';
      body = `${keyword}${variableMatch[2]} = ${value};`;
    }
  }

  return body;
}
