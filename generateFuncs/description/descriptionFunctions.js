import { extractFunctionBody } from "../extractCode/extractFunctionBody.js";

export const descriptionFunctions = (description, scriptContent) => {
  // Задаём ключевые слова, по которым будем определять описание функции.
  // В данном примере описание должно содержать одно из этих слов.
  const keywords= ["Инициализирует", "Управляет", "Выполняет"];

  // Ищем объявления функций через ключевое слово "function"
  const functionDocs = [
    ...scriptContent.matchAll(
      /(?:\n|^)\s*\/\*\*([\s\S]*?)\*\/\s*\n\s*function\s+([\w_]+)\s*\(([^)]*)\)/g
    )
  ];

  if (functionDocs.length === 0) return description; // Если нет функций, возвращаем исходное описание

  description += `## Описание функций:\n\n`;

  functionDocs.forEach(match => {
    const functionName = match[2]; // Имя функции
    const functionArgs = (match[3] || "").trim(); // Аргументы функции
    const jsDocComment = match[1]; // JSDoc-комментарий

    // Удаляем лишние символы (звёздочки) и разбиваем комментарий на строки
    const lines = jsDocComment
      .replace(/\*+/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== "");

    // Ищем первую строку, содержащую одно из ключевых слов.
    // Если строка начинается с "@function", удаляем этот тег.
    let funcDescriptionLine = "";
    for (const line of lines) {
      if (keywords.some(keyword => line.includes(keyword))) {
        funcDescriptionLine = line;
        break;
      }
    }

    // Если описание не найдено, пропускаем этот блок
    if (!funcDescriptionLine) {
      return;
    }

    // Удаляем тег @function, если он присутствует
    const funcDescription = funcDescriptionLine.replace(/@function\s*/, '').trim();

    description += `<details>\n<summary>🛠️ <strong>${functionName}</strong> - ${funcDescription}</summary>\n\n`;

    // Извлекаем теги @param для формирования таблицы параметров
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

    // Если функция имеет аргументы, создаём таблицу параметров
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

    // Извлекаем тело функции (функция extractFunctionBody должна быть реализована)
    const functionCode = extractFunctionBody(scriptContent, functionName);
    if (functionCode) {
      description += `\`\`\`js\n${functionCode}\n\`\`\`\n`;
    }

    description += `</details>\n\n`;
  });

  return description;
};
