export const descriptionProps = (description, scriptContent) => {
  const propsStart = scriptContent.indexOf("props:");
  if (propsStart === -1) return description; // Если нет props, выходим

  let openBraces = 0;
  let propsContent = "";
  let foundOpening = false;

  for (let i = propsStart; i < scriptContent.length; i++) {
    const char = scriptContent[i];

    if (char === "{") {
      openBraces++;
      foundOpening = true;
    }
    if (char === "}") openBraces--;

    if (foundOpening) propsContent += char;

    if (foundOpening && openBraces === 0) break; // Закрыли весь props
  }

  // Парсим пропсы
  description += `## Описание пропсов\n\n`;
  description += `| Пропс | Тип | Значение по умолчанию | Комментарий |\n`;
  description += `|-------|-----|-----------------------|-------------|\n`;

  // Регулярка для поиска пропсов с комментариями
  const propMatches = [...propsContent.matchAll(
      /(\w+)\s*:\s*{\s*type:\s*([\w]+)(?:[^}]*?default:\s*([^,}\n]+))?(?:[^}]*?comment:\s*'([^']+)')?/g
  )];

  propMatches.forEach((propMatch) => {
    const propName = propMatch[1];
    const propType = propMatch[2];
    const propDefaultValue = propMatch[3] ? propMatch[3].trim() : 'нет данных';
    const propComment = propMatch[4] ? propMatch[4].trim() : 'нет комментария'; // Если комментарий есть

    // Добавляем информацию о пропсе в таблицу
    description += `| \`${propName}\` | \`${propType}\` | \`${propDefaultValue}\` | ${propComment} |\n`;
  });

  return description;
};
