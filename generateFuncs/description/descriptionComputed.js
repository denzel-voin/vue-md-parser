import { extractComputedBody } from "../extractCode/extractComputedBody.js";

export const descriptionComputed = (description, scriptContent) => {
  // Ключевые слова для извлечения описания computed-свойств
  const keywords = ["Рассчитывает", "Вычисляет", "Определяет", "Обрабатывает"];

  const computedDocs = [
    ...scriptContent.matchAll(
      /\/\*\*([\s\S]*?)\*\/\s*\n\s*const\s*([\w\d_]+)\s*=\s*computed\s*\(\s*(\([^\)]*\))?\s*[^)]+\)/g
    ),
  ];

  if (computedDocs.length === 0) return description; // Если computed не найдены, выходим

  description += `## Описание computed:\n\n`;

  computedDocs.forEach(match => {
    // Извлекаем сырой комментарий и очищаем его от лишних символов
    let rawComment = match[1];
    let lines = rawComment
      .replace(/\*+/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== "");

    // Ищем первую строку, содержащую одно из ключевых слов
    let descLine = "";
    for (const line of lines) {
      if (keywords.some(keyword => line.includes(keyword))) {
        descLine = line;
        break;
      }
    }

    // Если строка содержит тег @computed, удаляем его
    descLine = descLine.replace(/@computed\s*/, '').trim();

    const functionName = match[2];

    description += `<details>\n<summary>🚀 <strong>${functionName}</strong> - ${descLine}</summary>\n\n`;

    // Извлекаем тело computed-свойства
    const computedCode = extractComputedBody(scriptContent, functionName);
    if (computedCode) {
      description += `\`\`\`js\n${computedCode}\n\`\`\`\n`;
    }

    description += `</details>\n\n`;
  });

  return description;
};
