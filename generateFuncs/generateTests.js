import path from 'path';
import fs from 'fs';
import {createTestFile} from "./generateInitTest.js";

const docsDir = path.join(process.cwd(), 'docs');
const themeDir = path.join(process.cwd(), 'docs', '.vitepress', 'theme');
const componentsDir = path.join(process.cwd(), 'docs', '.vitepress', 'theme', 'components');

export function createTests() {
    if (!fs.existsSync(themeDir)) {
        fs.mkdirSync(themeDir, { recursive: true });
    }
    if (!fs.existsSync(componentsDir)) {
        fs.mkdirSync(componentsDir, { recursive: true });
    }


    const testContent =`
  # Покрытие тестами

<ClientOnly>
  <TestRunner />
</ClientOnly>
  `

    const indexContent = `
  import DefaultTheme from 'vitepress/theme';
import { withMermaid } from 'vitepress-plugin-mermaid';
import TestRunner from './components/TestRunner.vue';

export default withMermaid({
  ...DefaultTheme,
  themeConfig: {
    search: {
      provider: 'local',
    },
  },
  mermaid: {
  },
  mermaidPlugin: {
    class: 'mermaid my-class',
  },
  enhanceApp({ app }) {
    app.component('TestRunner', TestRunner);
  },
});
  `

    const testRunner = `
<template>
  <iframe
    src="/test-coverage/index.html"
    width="1100px"
    height="640px"
    style="border: none"
  ></iframe>
</template>
`;

    fs.writeFileSync(path.join(docsDir, 'tests.md'), testContent);
    fs.writeFileSync(path.join(themeDir, 'index.js'), indexContent);
    fs.writeFileSync(path.join(componentsDir, 'TestRunner.vue'), testRunner);

    console.log('📘 Файлы install.md и usage.md созданы в папке guides.');
    createTestFile();
}