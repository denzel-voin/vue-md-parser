import {wrapText} from "../utils/wrapText.js";

export const descriptionVariables = (description, scriptContent) => {
  const variableDocs = [
    ...scriptContent.matchAll(
      /\/\*\*([\s\S]*?)\*\/\s*\n\s*(const|let|var)\s+([\w\d_]+)\s*=\s*(?!\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>|\s*computed\s*\()\s*([^;]+)(?=\s*;)/g
    ),
  ];

  if (variableDocs.length === 0) return description; // Если нет переменных, выходим

  description += `## Описание переменных\n\n`;
  description += `| Переменная | Значение | Описание |\n`;
  description += `|------------|----------|----------|\n`;

  variableDocs.forEach(match => {
    const variableName = match[3]; // Имя переменной
    const variableValue = match[4].trim(); // Значение переменной

    let descriptionText = match[1]
      .replace(/\*+/g, '') // Убираем звездочки `*`
      .trim()
      .split('.')[0] // Берём только текст до первой точки
      .trim();

    descriptionText = wrapText(descriptionText, 40);

    description += `| \`${variableName}\` | \`${variableValue}\` | <pre>${descriptionText}</pre>  |\n`;
  });

  description += `\n`;

  return description;
};
