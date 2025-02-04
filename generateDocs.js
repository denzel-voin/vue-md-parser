import fs from 'fs';
import path from 'path';
import {findComponents, updateConfig} from "./generateFuncs/generateDocsForComponents.js";

const componentsDir = path.join(process.cwd(), 'src', 'front', 'src');
const docsDir = path.join(process.cwd(), 'docs');

// Проверка существования docs
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// Запуск генерации документации
console.log('🚀 Генерация документации для компонентов...');
const sidebarItems = findComponents(componentsDir);
updateConfig(sidebarItems);
console.log('🎉 Генерация завершена!');
