#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {createGuides, findComponents, updateConfig} from "./generateFuncs/generateDocsForComponents.js";
import {generateReadme} from "./generateFuncs/generateReadme";
import {generateIndex} from "./generateFuncs/generateIndex";

const componentsDir = path.join(process.cwd(), 'src', 'front', 'src');
const docsDir = path.join(process.cwd(), 'docs');
const source = path.resolve(__dirname, '../README.md');
const target = path.resolve(__dirname, './docs/README.md');
const indexFile = path.resolve(__dirname, './docs/index.md');

// Проверка существования docs
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, {recursive: true});
}

// Запуск генерации документации
console.log('🚀 Генерация документации для компонентов...');
const sidebarItems = findComponents(componentsDir);
updateConfig(sidebarItems);
console.log('🎉 Генерация завершена!');
createGuides();
generateReadme(source, target);
generateIndex(indexFile, content);