const fs = require('fs');
const path = require('path');
const { createInterface } = require('readline');

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Nhập đường dẫn của thư mục chứa các thư mục cần nén: ', (directoryPath) => {
    const compressDirectories = (dirPath) => {
        const folders = fs.readdirSync(dirPath, { withFileTypes: true })
            .filter(item => item.isDirectory())
            .map(item => item.name);

        folders.forEach((folder) => {
            const archiveName = folder + '.zip';
            const folderPath = path.join(dirPath, folder);
            const outputPath = path.join(dirPath, archiveName);
            
            compressDirectory(folderPath, outputPath);
        });

        console.log('Đã nén tất cả các thư mục con thành công!');
        rl.close();
    };

    const compressDirectory = (dirPath, outputPath) => {
        const archive = require('archiver').create('zip', {});
        const output = fs.createWriteStream(outputPath);

        archive.pipe(output);
        archive.directory(dirPath, false);
        archive.finalize();

        console.log(`Thư mục ${path.basename(dirPath)} đã được nén thành công và lưu vào tệp tin ${path.basename(outputPath)}`);
    };

    compressDirectories(directoryPath);
});
