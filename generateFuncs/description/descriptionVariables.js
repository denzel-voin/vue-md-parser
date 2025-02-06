import { wrapText } from "../utils/wrapText.js";

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
    let variableValue = match[4].trim(); // Значение переменной

    // Проверяем, если значение переменной - это объект или массив
    if (variableValue.startsWith('[') || variableValue.startsWith('{')) {
      // Используем JSON.stringify для объектов и массивов
      try {
        // Преобразуем объект/массив в строку с отступами
        variableValue = JSON.stringify(eval(variableValue), null, 2)
            .replace(/\n/g, ' ') // Убираем переносы строк внутри данных
            .replace(/ {2,}/g, ' ') // Заменяем множественные пробелы на один
            .trim();
      } catch (e) {
        // В случае ошибки просто оставляем исходное значение
        console.error('Ошибка при обработке переменной:', variableName, e);
      }
    }

    // Форматируем описание переменной (для документации)
    let descriptionText = match[1]
        .replace(/\*+/g, '') // Убираем звездочки `*`
        .trim()
        .split('.')[0] // Берём только текст до первой точки
        .trim();

    variableValue = wrapText(variableValue, 30);
    descriptionText = wrapText(descriptionText, 35);

    // Форматируем описание переменной в таблице
    description += `| \`${variableName}\` | <pre>${variableValue}</pre> | <pre>${descriptionText}</pre> |\n`;
  });

  description += `\n`;

  return description;
};
