import { extractArrowFunctionBody } from "../extractCode/extractArrowFunctionBody.js";

export const descriptionArrowFunctions = (description, scriptContent) => {
  // Задаём ключевые слова для описания стрелочных функций.
  const keywords= ["Фильтрует", "Преобразует", "Обрабатывает"];

  const arrowFunctionDocs = [
    ...scriptContent.matchAll(
      /\/\*\*([\s\S]*?)\*\/\s*\n\s*(?:export\s+)?(async\s+)?(const|let|var)?\s*([\w\d_]+)\s*=\s*(async\s*)?\(([^)]*)\)\s*=>/g
    )
  ];

  if (arrowFunctionDocs.length === 0) return description; // Если нет стрелочных функций, выходим

  description += `## Описание стрелочных функций:\n\n`;

  arrowFunctionDocs.forEach((match) => {
    const jsDocComment = match[1]; // JSDoc-комментарий
    const functionName = match[4]; // Имя функции
    const functionArgs = (match[6] || "").trim(); // Аргументы функции

    // Очищаем комментарий от лишних символов и разбиваем на строки
    let lines = jsDocComment
      .replace(/\*+/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== "");

    // Удаляем строку с тегом @arrowFunc, чтобы он не отображался в описании
    lines = lines.filter(line => !line.includes('@arrowFunc'));

    // Ищем первую строку, которая не содержит "@param" и содержит одно из ключевых слов
    let arrowFuncDescriptionLine = "";
    for (const line of lines) {
      if (!line.includes('@param') && keywords.some(keyword => line.includes(keyword))) {
        arrowFuncDescriptionLine = line;
        break;
      }
    }

    // Если ни одна строка не удовлетворяет условию, используем первую строку, не содержащую "@param"
    if (!arrowFuncDescriptionLine) {
      arrowFuncDescriptionLine = lines.find(line => !line.includes('@param')) || "";
    }

    const arrowFuncDescription = arrowFuncDescriptionLine.trim();

    description += `<details>\n<summary>🛠️ <strong>${functionName}</strong> - ${arrowFuncDescription}</summary>\n\n`;

    // Извлекаем теги @param для формирования таблицы аргументов
    const paramDescriptions = {};
    const paramTypes = {};
    const paramMatches = [...jsDocComment.matchAll(/@param\s+\{([^}]+)\}\s+(\w+)\s+(.+)/g)];
    paramMatches.forEach(paramMatch => {
      const type = paramMatch[1].trim();
      const paramName = paramMatch[2].trim();
      const paramDesc = paramMatch[3].trim();
      paramTypes[paramName] = type;
      paramDescriptions[paramName] = paramDesc;
    });

    // Если есть аргументы, создаём таблицу
    if (functionArgs) {
      const argsList = functionArgs.split(',').map(arg => arg.trim()).filter(arg => arg);
      if (argsList.length > 0) {
        description += `**Аргументы:**\n\n`;
        description += `| Имя аргумента | Тип | Описание |\n`;
        description += `|--------------|-----|----------|\n`;
        argsList.forEach(arg => {
          description += `| \`${arg}\` | \`${paramTypes[arg] || 'any'}\` | ${paramDescriptions[arg] || '-'} |\n`;
        });
        description += `\n`;
      }
    }

    // Извлекаем тело стрелочной функции (функция extractArrowFunctionBody должна быть реализована)
    const arrowFunctionCode = extractArrowFunctionBody(scriptContent, functionName);
    if (arrowFunctionCode) {
      description += `\`\`\`js\n${arrowFunctionCode}\n\`\`\`\n`;
    }

    description += `</details>\n\n`;
  });

  return description;
};
