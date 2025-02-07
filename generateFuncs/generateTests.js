import path from 'path';
import fs from 'fs';

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
  # Тестирование

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
  <div>
    <h2>Результаты тестов:</h2>
    <pre>{{ results }}</pre>
    <button class="test-button" @click="handleRunTests">
      {{
        results === 'Нажмите кнопку, чтобы запустить тесты.'
          ? 'Запустить тесты'
          : 'Перезапустить тесты'
      }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { runTests } from '../../../../tests/sampleTests.js';

const results = ref('Нажмите кнопку, чтобы запустить тесты.');

const handleRunTests = async () => {
  results.value = 'Запускаются тесты...';
  try {
    const testResults = await runTests();
    results.value = testResults;
  } catch (error) {
    results.value = \`Ошибка при запуске тестов: \${error.message}\`;
  }
};
</script>

<style scoped>
.test-button {
  background-color: #9900ff;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.test-button:hover {
  background-color: #9b1cef;
}
</style>
`;

    fs.writeFileSync(path.join(docsDir, 'tests.md'), testContent);
    fs.writeFileSync(path.join(themeDir, 'index.js'), indexContent);
    fs.writeFileSync(path.join(componentsDir, 'TestRunner.vue'), testRunner);

    console.log('📘 Файлы install.md и usage.md созданы в папке guides.');
}