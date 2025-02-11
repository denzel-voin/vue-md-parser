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

    <!-- Общее состояние тестов -->
    <div v-if="results.success" class="success">✅ Все тесты успешно пройдены!</div>
    <div v-else-if="results.numFailedTestSuites > 0" class="error">
      ❌ Ошибки в тестах: {{ results.numFailedTestSuites }} из {{ results.numTotalTestSuites }}
    </div>

    <!-- Сводная информация -->
    <div v-if="results.testResults" class="summary">
      <h3>Сводка по тестам:</h3>
      <ul>
        <li><strong>Общее количество тестов:</strong> {{ results.numTotalTests }}</li>
        <li>
          <strong>Пройдено:</strong> {{ results.numPassedTests }} ({{
            getPercentage(results.numPassedTests, results.numTotalTests)
          }}%)
        </li>
        <li>
          <strong>Неудачных:</strong> {{ results.numFailedTests }} ({{
            getPercentage(results.numFailedTests, results.numTotalTests)
          }}%)
        </li>
      </ul>
    </div>

    <!-- Список успешных тестов -->
    <div v-if="passedTests.length">
      <h3>Успешные тесты:</h3>
      <ul>
        <li v-for="test in passedTests" :key="test.fullName">
          <strong>{{ test.fullName }}</strong> ✅ ({{ test.duration }} мс)
        </li>
      </ul>
    </div>

    <!-- Список неудачных тестов -->
    <div v-if="failedTests.length">
      <h3>Неудачные тесты:</h3>
      <ul>
        <li v-for="(test, index) in failedTests" :key="test.fullName">
          <strong>{{ test.fullName }}</strong> ❌ ({{ test.duration }} мс)
          <pre v-if="test.failureMessages.length" class="error-log">
            <button @click="toggleError(index)" class="error-toggle-btn">
              {{ isErrorVisible(index) ? 'Скрыть ошибки' : 'Показать ошибки' }}
            </button>
            <div v-if="isErrorVisible(index)">
              <strong>Ожидалось:</strong> {{ extractTestValue(test.failureMessages, 'Expected') }}
              <strong>Получено:</strong> {{ extractTestValue(test.failureMessages, 'Received') }}
            </div>
          </pre>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const results = ref({});
const errorMessage = ref('');
const errorVisibility = ref({});

const toggleError = (index) => {
  errorVisibility.value[index] = !errorVisibility.value[index];
};

const isErrorVisible = (index) => {
  return !!errorVisibility.value[index];
};

const getPercentage = (num, total) => {
  return ((num / total) * 100).toFixed(2);
};

onMounted(async () => {
  try {
    const response = await fetch('/test-results.json');
    const data = await response.json();
    results.value = data;

    if (!data.success) {
      errorMessage.value = data.testResults
        .map((t) => (t.failureMessages ? t.failureMessages.join('\\n') : ''))
        .join('\\n\\n');
    }
  } catch (error) {
    errorMessage.value = 'Ошибка загрузки данных';
  }
});

const passedTests = computed(() => {
  return (
    results.value?.testResults?.flatMap((testSuite) =>
      testSuite.assertionResults
        ?.filter((test) => test.status === 'passed')
        .map((test) => ({
          ...test,
          failureMessages: test.failureMessages || [],
        })),
    ) || []
  );
});

const failedTests = computed(() => {
  return (
    results.value?.testResults?.flatMap((testSuite) =>
      testSuite.assertionResults
        ?.filter((test) => test.status === 'failed')
        .map((test) => ({
          ...test,
          failureMessages: test.failureMessages || [],
        })),
    ) || []
  );
});

// Универсальная функция для извлечения данных из сообщений
const extractTestValue = (messages, type) => {
  const failureMessage = messages.find((msg) => msg.includes(type + ':'));
  if (failureMessage) {
    const match = failureMessage.match(new RegExp(\`${type}: (.*)\`));
    if (match) {
      return cleanTestMessage(match[1]);
    }
  }
  return 'Не указано';
};

// Очистка от лишних данных и ANSI кодов
const cleanTestMessage = (message) => {
  return message.replace(/\x1b\\[[0-9;]*m/g, '').trim();
};
</script>

<style scoped>
.success {
  color: green;
  font-weight: bold;
}

.error {
  color: red;
  font-weight: bold;
}

.warning {
  color: orange;
  font-weight: bold;
}

.error-log {
  background: rgba(255, 221, 221, 0.1);
  border-left: 4px solid red;
  padding: 5px;
  white-space: pre-wrap;
  font-family: monospace;
}

.summary {
  margin-bottom: 20px;
}

.error-toggle-btn {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
  margin-bottom: 5px;
}

.error-toggle-btn:hover {
  background-color: #ff4500;
}
</style>
`;

    fs.writeFileSync(path.join(docsDir, 'tests.md'), testContent);
    fs.writeFileSync(path.join(themeDir, 'index.js'), indexContent);
    fs.writeFileSync(path.join(componentsDir, 'TestRunner.vue'), testRunner);

    console.log('📘 Файлы install.md и usage.md созданы в папке guides.');
}