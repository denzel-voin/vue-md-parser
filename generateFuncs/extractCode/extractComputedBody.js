export const extractComputedBody = (scriptContent, functionName) => {
  // Ищем начало определения computed-свойства по имени функции
  const regex = new RegExp(`const\\s+${functionName}\\s*=\\s*computed\\s*\\(\\s*\\(?[^)]*\\)?\\s*=>\\s*\\{`, 'm');
  const match = regex.exec(scriptContent);
  if (!match) return null;

  // Начальная позиция – начало фигурной скобки тела computed
  let startIndex = match.index + match[0].length - 1; // позиция открывающей фигурной скобки
  let currentIndex = startIndex;
  const stack = [];
  let computedBody = '';

  // Идем по символам начиная с открывающей скобки и ищем совпадение закрывающей
  while (currentIndex < scriptContent.length) {
    const char = scriptContent[currentIndex];
    computedBody += char;
    if (char === '{') {
      stack.push(char);
    } else if (char === '}') {
      stack.pop();
      // Если стек пуст, значит нашли завершающую фигурную скобку для текущего блока
      if (stack.length === 0) {
        break;
      }
    }
    currentIndex++;
  }
  return `const ${functionName} = computed(() => ${computedBody.trim()}\n);`;
};