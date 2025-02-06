import fs from 'fs';

export const generateIndex = (indexFile) => {
    let name = 'Проект';
    let text = 'Документация по проекту';

    // Проверяем, существует ли файл, и извлекаем значения name и text
    if (fs.existsSync(indexFile)) {
        const fileContent = fs.readFileSync(indexFile, 'utf-8');

        // Регулярные выражения для поиска значений
        const nameMatch = fileContent.match(/^hero:\s*\n\s*name:\s*"(.+?)"/m);
        const textMatch = fileContent.match(/^hero:\s*\n\s*name:.*\n\s*text:\s*"(.+?)"/m);

        if (nameMatch) name = nameMatch[1];
        if (textMatch) text = textMatch[1];
    }

    // Новый контент с сохраненными значениями
    const content = `---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "${name}"
  text: "${text}"
  actions:
    - theme: brand
      text: Документация
      link: /README

features:
  - title: Инструкция
    details: Подробная инструкция по установке
    link: /guides/install
  - title: Инструкция по ведению и заполнению
    details: Подробная инструкция по ведению и заполнению
    link: /guides/usage
---

`;

    fs.writeFileSync(indexFile, content);
    console.log('✅ index.md успешно создан/обновлён!');
};
