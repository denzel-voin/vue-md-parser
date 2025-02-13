#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {createGuides, findComponents, updateConfig} from "./generateFuncs/generateDocsForComponents.js";
import {generateReadme} from "./generateFuncs/generateReadme.js";
import {generateIndex} from "./generateFuncs/generateIndex.js";
import {createTests} from "./generateFuncs/generateTests.js";

const componentsDir = path.resolve(process.cwd(), '../src', 'front', 'src');
const docsDir = path.join(process.cwd(), 'docs');
const source = path.resolve(process.cwd(), 'README.md');
const target = path.resolve(process.cwd(), 'docs/README.md');
const indexFile = path.resolve(process.cwd(), 'docs/index.md');

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
createTests();
generateReadme(source, target);
generateIndex(indexFile);