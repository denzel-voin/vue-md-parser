import fs from 'fs';

const content = `---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Портал"
  text: "Документация по порталу"
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

export const generateIndex = (indexFile, content) => {
    fs.writeFileSync(indexFile, content);
    console.log('✅ index.md успешно создан/обновлён!');
}
