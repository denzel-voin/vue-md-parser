import path from "path";
import fs from "fs";
import { extractDescription } from "./extractCode/extractDescription.js";

// Пути к папкам
const docsComponentsDir = path.join(process.cwd(), 'docs', 'src');
const configPath = path.join(process.cwd(), 'docs', '.vitepress', 'config.mjs');
const guidesDir = path.join(process.cwd(), 'docs', 'guides');

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
  let docContent = `# ${name}\n\n${description}\n\n`;

  if (filePath.endsWith('.vue')) {
    docContent += `## Пример использования\n\n\`\`\`vue\nimport ${name} from '@/components/${importPath}';\n\`\`\`\n\n\`\`\`vue\n  <${name} />\n\`\`\`\n\n`;
  } else if (filePath.endsWith('.js')) {
    docContent += `\`\`\`js\nimport * as ${name} from '@/components/${importPath}';\n\`\`\`\n\n`;
  }

  docContent += `---\n> Документация сгенерирована автоматически.\n`;

  fs.writeFileSync(docFilePath, docContent);
  console.log(`📘 Документация для ${name} сгенерирована.`);
}

// Функция обновления config.mjs
export function updateConfig(items) {
  const configTemplate = `import { withMermaid } from 'vitepress-plugin-mermaid';\n\nexport default withMermaid({\n  themeConfig: {\n    search: {\n      provider: 'local'\n    },\n    sidebar: [\n      {\n        text: 'Структура',\n        collapsed: false,\n        items: ${JSON.stringify(items, null, 2)}\n      },\n      {\n        text: 'Гайды',\n        collapsed: true,\n        items: [\n          { text: 'Как установить', link: '/guides/install' },\n          { text: 'Как использовать', link: '/guides/usage' },\n          { text: 'Правила комитов', link: '/guides/commits' }\n        ]\n      }\n    ]\n  },\nmermaid: {
    // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
  },
  // optionally set additional config for plugin itself with MermaidPluginConfig
  mermaidPlugin: {
    class: 'mermaid my-class', // set additional css classes for parent container
  },});\n`;

  fs.writeFileSync(configPath, configTemplate);
  console.log('✅ Sidebar в config.mjs обновлён!');
}

// Создание папки guides и файлов install.md, usage.md
export function createGuides() {
  if (!fs.existsSync(guidesDir)) {
    fs.mkdirSync(guidesDir, { recursive: true });
  }

  const installContent = `
  # Установка документации

## Установка VitePress

Для начала необходимо установить VitePress:

\`\`\`bash
npm add -D vitepress
\`\`\`

## Инициализируем проект:

\`\`\`bash
npx vitepress init
\`\`\`

#### Во время инициализации вам будет предложено выбрать конфигурацию:

\`\`\`txt
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs
│
◇  Site title:
│  Наименование проекта
│
◇  Site description:
│  Описание проекта
│
◆  Theme:
│  ● Default Theme (Out of the box, good-looking docs)
│  ○ Default Theme + Customization
│  ○ Custom Theme
└
\`\`\`

## Установка vue-md-parser

#### Далее необходимо установить vue-md-parser:

\`\`\`bash
npm install -g vue-md-parser
\`\`\`

## Настройка скриптов

#### Откройте package.json и измените скрипт для разработки документации:

\`\`\`json
"scripts": {
"docs:dev": "vue-md-parser && vitepress dev docs"
}
\`\`\`

## Запуск сервера

\`\`\`bash
npm run docs:dev
\`\`\`

## Сервер будет доступен на http://localhost:5173/
  `;

  const usageContent = `
# Использование документации

## Добавление комментариев для генерации документации

### Описание компонента

Описание компонента должно быть указано первым комментарием в теге \`<template>\`:

\`\`\`html
<!-- Описание -->
\`\`\`

## Порядок структуры \`<script>\`

1. props
2. Переменные
3. Обычные функции
4. Стрелочные функции
5. computed
6. watch

## Props

\`\`\`js
props: {
    LikeDialog: {
      type: Boolean,
      default: false,
      comment: 'Модалка лайка'
    }
}
\`\`\`

> Поля default и comment являются опциональными. Commnet записывается в одиночные ковычки.

## Переменные

Комментарии к переменным пишутся в формате JSDoc, с обязательной точкой в конце.

Пример:

\`\`\`js
/**
 * Получаем объект alert из хранилища alert с использованием store для уведомлений.
 */
const feedalert = useAlertStore().alert;
\`\`\`

Шаблон:

\`\`\`js
/**
 * .
 */
\`\`\`

## Функции

Комментарии к обычным функциям оформляются в формате JSDoc с ключевым словом \`@function\`. После \`@function\` должно идти одно из трех ключевых слов: \`Инициализирует\`, \`Управляет\`, \`Выполняет\`.

Пример:

\`\`\`js
/**
 * @function Выполняет загрузку данных обратной связи с сервера.
 */
function f_feedbackdata() {
    axiosApiInstance.get('api/feedback/feedbackdata/')
        .then(data => {
            feedbackdata.value = data.data;
            // Если оценки отсутствуют, инициализируем их
            if (feedbackdata.value.nowrating.length === 0) {
                for (let x of feedbackdata.value.basecrit) {
                    feedbackdata.value.nowrating.push({ rating: x.rating, crit: x.id, id: null });
                }
            }
            // Если комментарий отсутствует, создаем пустой объект
            if (feedbackdata.value.nowcomment === null) {
                feedbackdata.value.nowcomment = { comment: '', id: null };
            }
        });
}
\`\`\`

Шаблон:

\`\`\`js
/**
 * @function Инициализирует Управляет Выполняет.
 */
\`\`\`

## Стрелочные функции

Комментарии к стрелочным функциям оформляются с ключевым словом \`@arrowFunc\`. Следующая строка должна начинаться с одного из трех слов: \`Фильтрует\`, \`Преобразует\`, \`Обрабатывает\`.

Пример:

\`\`\`js
/**
 * @arrowFunc
 * Обрабатывает данные для карусели с сервера.
 */
const getfromserver = () => {
        axiosApiInstance.get("api/navigation/carousels/").then((result) => {
            // Проверяем наличие сообщения об ошибке
            if (result.data.mess !== "") {
                feedalert.alert = true;
                feedalert.text = result.data.mess;
                feedalert.color = "red-darken-2";
                feedalert.ico = "mdi-alert-outline";
            }

            // Если сервер вернул данные, обновляем массив карусели
            if (result.data.result.length > 0) {
                carous.value = result.data.result;
            }
        });
    };
\`\`\`

Шаблон:

\`\`\`js
/**
 * @arrowFunc
 * Фильтрует Преобразует Обрабатывает.
 */
\`\`\`

## Computed

Комментарии к computed свойствам оформляются с ключевым словом \`@computed\`. Комментарий должен начинаться с одного из трех слов: \`Выводит\`, \`Определяет\`, \`Подсчитывает\`.

Пример:

\`\`\`js
/**
 * @computed Подсчитывает средний рейтинг на основе оценок пользователя.
 */
const average = computed(() => {
        const sum = feedbackdata.value.nowrating.reduce((total, obj) => total + obj.rating, 0);
        const sumlen = sum / feedbackdata.value.nowrating.length;
        return Number.isInteger(sumlen) ? sumlen : sumlen.toFixed(1);
    });
\`\`\`

Шаблон:

\`\`\`js
/**
 * @computed Выводит Определяет Подсчитывает.
 */
\`\`\`

## Watch

Комментарии к watch оформляются с ключевым словом \`@watch\`. Комментарий должен начинаться с одного из трех слов: \`Отслеживает\`, \`Реагирует\`, \`Синхронизирует\`.

Пример:

\`\`\`js
/**
 * @watch
 * Получает данные для карусели с сервера.
 */
watch(
    () => indximg,
    (newValue, oldValue) => {
        if (newValue) {
            galleryimges.value = newsFull.value.gallery[newValue.value];
        }
    },
    { deep: true }
);
\`\`\`

Шаблон:

\`\`\`js
/**
 * @watch
 * Отслеживает Реагирует Синхронизирует.
 */
\`\`\`

## Аргументы

Комментарии к аргументам оформляются с ключевым словом \`@param\`.

Пример:

\`\`\`js
/**
 * @arrowFunc
 * Фильтрует Преобразует Обрабатывает.
 * @param {number} idus ID пользователя.
 */
const getcard = async (idus) => {
    menuGetUserDialog.value = true
    iduser.value = idus
  }
\`\`\`

Если аргументов несколько, то каждый пишется с новой строчки:

\`\`\`js
/**
 * @arrowFunc
 * Фильтрует Преобразует Обрабатывает.
 * @param {number} pos Позиция.
 * @param {string} name Название раунда.
 */
const detailRound = (pos, name) => {
    idpos.value=pos
    namepos.value=name
    dialogDetailRound.value=!dialogDetailRound.value
    axiosApiInstance.get(\api/general_vacation/dailyload/?id=pos\).then(data => {
      t_dailyRound.value = data.data

      result.value=JSON.parse(JSON.stringify(data.data.daily))

    })
  }
\`\`\`

Шаблон:

\`\`\`js
/**
 * @arrowFunc
 * Фильтрует Преобразует Обрабатывает.
 * @param {} .
 */
\`\`\`
`;

  const commitContent =`
  ## Заголовок должен содержать тип, номер задачи и название коммита. 
  Формат: <тип> [<номер задачи>]: <название>
  
  | Название | Описание |
  |----------|----------| 
  | \`feat\` | Новый функционал |
  | \`fix\` | Исправление ошибки |
  | \`docs\` | Изменения в документации |
  | \`style\` | Изменения, не влияющие на функциональность |
  | \`refactor\` | Изменения кода, не исправляющие ошибки и не добавляющие функционал |
  | \`perf\` | Изменения, улучшающие производительность |
  | \`test\` | Добавление тестов |
  | \`chore\` | Изменения в процессе сборки или вспомогательных инструментах. |
  
   Пример:

\`\`\`bash
feat [X-01]: я тут накоммитил
\`\`\`
  `

  fs.writeFileSync(path.join(guidesDir, 'commits.md'), commitContent);
  fs.writeFileSync(path.join(guidesDir, 'install.md'), installContent);
  fs.writeFileSync(path.join(guidesDir, 'usage.md'), usageContent);

  console.log('📘 Файлы install.md и usage.md созданы в папке guides.');
}