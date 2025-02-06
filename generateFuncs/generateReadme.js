import fs from "fs";

export const generateReadme = (source, target) => {
    if (fs.existsSync(source)) {
        fs.copyFileSync(source, target);
        console.log('✅ README.md успешно скопирован!');
    } else {
        fs.writeFileSync(target, '# Документация\n\n⚠️ Оригинальный README.md не найден.');
        console.log('⚠️ Исходный README.md не найден, создан пустой файл.');
    }
}