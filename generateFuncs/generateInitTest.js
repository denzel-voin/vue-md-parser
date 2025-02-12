import path from 'path';
import fs from 'fs';

export function createTestFile() {
    // Задаём путь к директории, которую нужно создать (src/fron/src/тест)
    const testFolderPath = path.join(process.cwd(), 'src', 'front', 'src', 'tests');
    // Задаём полный путь к файлу, который нужно создать (App.test.js внутри папки тест)
    const testFilePath = path.join(testFolderPath, 'App.test.js');

    // Создаём директорию с опцией recursive, чтобы создать все необходимые уровни
    fs.mkdir(testFolderPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Ошибка при создании папки:', err);
            return;
        }
        console.log('Папка успешно создана по пути:', testFolderPath);

        // Пример содержимого файла App.test.js
        const fileContent = `
describe('App.vue', () => {
  it('должен всегда проходить', () => {
    expect(true).toBe(true);
  });
});
`;

        // Создаём (или перезаписываем) файл App.test.js
        fs.writeFile(testFilePath, fileContent, (err) => {
            if (err) {
                console.error('Ошибка при создании файла:', err);
                return;
            }
            console.log('Файл успешно создан по пути:', testFilePath);
        });
    });
}