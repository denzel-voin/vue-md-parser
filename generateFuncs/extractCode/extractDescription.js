// Функция для извлечения описания компонента и его частей
import {descriptionProps} from "../description/descriptionProps.js";
import {descriptionVariables} from "../description/descriptionVariables.js";
import {descriptionFunctions} from "../description/descriptionFunctions.js";
import {descriptionArrowFunctions} from "../description/descriptionArrowFunctions.js";
import {descriptionComputed} from "../description/descriptionComputed.js";
import {descriptionWatch} from "../description/descriptionWatch.js";

export function extractDescription(content) {
  let description = '';

  // Разбиваем файл на части (template, script)
  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);

  // Ищем HTML-комментарии в шаблоне
  if (templateMatch) {
    const htmlComment = templateMatch[1].match(/<!--([\s\S]*?)-->/);
    if (htmlComment) {
      description += `### ${htmlComment[1].trim()}\n\n`;
    }
  }

  if (scriptMatch) {
    let scriptContent = scriptMatch[1];
    description = descriptionProps(description, scriptContent);
    description = descriptionVariables(description, scriptContent);
    description = descriptionFunctions(description, scriptContent);
    description = descriptionArrowFunctions(description, scriptContent);
    description = descriptionComputed(description, scriptContent);
    description = descriptionWatch(description, scriptContent);
  }

  return description || 'Описание отсутствует.';
}
