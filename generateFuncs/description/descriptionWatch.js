export const descriptionWatch = (description, scriptContent) => {
  // Задаём ключевые слова для описания watch-блоков.
  const keywords = ["Отслеживает", "Реагирует", "Синхронизирует"];

  const watchDocs = [
    ...scriptContent.matchAll(
      /\/\*\*([\s\S]*?)\*\/\s*\n\s*watch\s*\(\s*([\s\S]*?)\)\s*;/g
    )
  ];

  if (watchDocs.length === 0) return description; // Если блоков watch нет, возвращаем описание без изменений

  description += `## Описание watch:\n\n`;

  watchDocs.forEach(match => {
    const jsDocComment = match[1]; // JSDoc-комментарий, например:
    //   @watch
    //   Получает данные для карусели с сервера.
    const watchBody = match[2].trim(); // Всё, что находится внутри вызова watch( ... )

    // Очищаем комментарий от лишних символов (звёздочек) и разбиваем на строки
    let lines = jsDocComment
      .replace(/\*+/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== "");

    // Удаляем тег @watch из каждой строки (заменяем его на пустую строку)
    lines = lines.map(line => line.replace(/@watch\s*/, '').trim());

    // Ищем первую строку, содержащую одно из ключевых слов
    let watchDescriptionLine = "";
    for (const line of lines) {
      if (keywords.some(keyword => line.includes(keyword))) {
        watchDescriptionLine = line;
        break;
      }
    }
    // Если ни одна строка не удовлетворяет условию, используем первую строку, не содержащую "@param"
    if (!watchDescriptionLine) {
      watchDescriptionLine = lines.find(line => !line.includes('@param')) || "";
    }

    description += `<details>\n<summary>🔄 <strong>watch</strong> - ${watchDescriptionLine}</summary>\n\n`;

    // Выводим код вызова watch в виде блока с подсветкой синтаксиса:
    description += "```js\n";
    description += `watch(${watchBody})\n`;
    description += "```\n\n";

    description += `</details>\n\n`;
  });

  return description;
};
