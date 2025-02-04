import path from "path";
import fs from "fs";
import { extractDescription } from "./extractCode/extractDescription.js";

// Пути к папкам
const docsComponentsDir = path.join(process.cwd(), 'docs', 'src');
const configPath = path.join(process.cwd(), 'docs', '.vitepress', 'config.mjs');

// Функция для рекурсивного поиска файлов .vue и .js
export function findComponents(dir, basePath = '') {
  const items = [];

  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const relativePath = path.join(basePath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      // Если это папка, рекурсивно обрабатываем её содержимое
      const subItems = findComponents(fullPath, relativePath);
      if (subItems.length) {
        items.push({
          text: file,
          collapsed: true,
          items: subItems
        });
      }
    } else if (file.endsWith('.vue') || file.endsWith('.js')) {
      const componentName = file.replace(/\.(vue|js)$/, '');
      generateDocFile(fullPath, componentName, relativePath);
      items.push({ text: componentName, link: `/src/${relativePath.replace(/\.(vue|js)$/, '')}` });
    }
  });

  return items;
}

// Функция генерации документации для одного компонента или модуля
export function generateDocFile(filePath, name, relativePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const description = extractDescription(content);

  const docDir = path.join(docsComponentsDir, path.dirname(relativePath));
  const docFilePath = path.join(docDir, `${name}.md`);

  if (!fs.existsSync(docDir)) {
    fs.mkdirSync(docDir, { recursive: true });
  }

  const importPath = relativePath.replace(/\.(vue|js)$/, '');
  let docContent = `# ${name}

${description}

`;

  if (filePath.endsWith('.vue')) {
    docContent += `## Пример использования

\`\`\`vue
import ${name} from '@/components/${importPath}';
\`\`\`

\`\`\`vue
  <${name} />
\`\`\`

`;
  } else if (filePath.endsWith('.js')) {
    docContent += `\`\`\`js
import * as ${name} from '@/components/${importPath}';
\`\`\`

`;
  }

  docContent += `---
> Документация сгенерирована автоматически.
`;

  fs.writeFileSync(docFilePath, docContent);
  console.log(`📘 Документация для ${name} сгенерирована.`);
}

// Функция обновления config.mjs
export function updateConfig(items) {
  const configTemplate = `import { defineConfig } from 'vitepress';

export default defineConfig({
  themeConfig: {
    search: {
      provider: 'local'
    },
    sidebar: [
      {
        text: 'Структура',
        collapsed: false,
        items: ${JSON.stringify(items, null, 2)}
      },
      {
        text: 'Гайды',
        collapsed: true,
        items: [
          { text: 'Как установить', link: '/guides/install' },
          { text: 'Как использовать', link: '/guides/usage' },
        ]
      }
    ]
  }
});
`;

  fs.writeFileSync(configPath, configTemplate);
  console.log('✅ Sidebar в config.mjs обновлён!');
}
