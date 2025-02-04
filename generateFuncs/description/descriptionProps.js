export const descriptionProps = (description, scriptContent) => {
  const propDocs = [...scriptContent.matchAll(/props:\s*{([\s\S]*?)}/g)];

  if (propDocs.length === 0) return description; // Если нет пропсов, выходим

  description += `## Описание пропсов\n\n`;
  description += `| Пропс | Тип | Значение по умолчанию |\n`;
  description += `|-------|-----|-----------------------|\n`;

  propDocs.forEach((match) => {
    const propContent = match[1];

    // Исправленное регулярное выражение для корректного извлечения пропсов
    const propMatches = [...propContent.matchAll(/(\w+):\s*{[^}]*type:\s*['"]?(\w+)['"]?[^}]*default:\s*([^,}\n]+)/g)];

    propMatches.forEach((propMatch) => {
      const propName = propMatch[1]; // Имя пропса
      const propType = propMatch[2]; // Тип пропса
      const propDefaultValue = propMatch[3].trim(); // Значение по умолчанию

      description += `| \`${propName}\` | \`${propType}\` | \`${propDefaultValue}\` |\n`;
    });

    description += `\n`;
  });

  return description;
};
