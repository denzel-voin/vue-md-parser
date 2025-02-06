import fs from "fs";
import path from "path";

export const generateReadme = (source, target) => {
    // Получаем путь к директории, где будет создан target
    const targetDir = path.dirname(target);

    // Если директория не существует, создаём её
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    if (fs.existsSync(source)) {
        fs.copyFileSync(source, target);
        console.log('✅ README.md успешно скопирован!');
    } else {
        fs.writeFileSync(target, '# Документация\n\n⚠️ Оригинальный README.md не найден.');
        console.log('⚠️ Исходный README.md не найден, создан пустой файл.');
    }
}
