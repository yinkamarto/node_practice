const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');



fs.readFile(path.join(__dirname, 'files', 'read.txt'), 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

console.log('hello...')

fs.writeFile(path.join(__dirname, 'files', 'write.txt'), 'I am writing to file', (err) => {
    if (err) throw err;
    console.log('Write complete');

    fs.appendFile(path.join(__dirname, 'files', 'write.txt'), '\nAppending to file', (err) => {
        if (err) throw err;
        console.log('Append complete');

        fs.rename(path.join(__dirname, 'files', 'write.txt'), path.join(__dirname, 'files', 'newName.txt'), (err) => {
            if (err) throw err;
            console.log('Rename complete');
        });
    });
});

const fileOps = async () => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, 'files', 'read.txt'), 'utf8');
        console.log(data);
        await fsPromises.unlink(path.join(__dirname, 'files', 'read.txt'));

        await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data);
        await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\n\nAppended to file.');
        await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'promiseComplete.txt'));
        const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'promiseComplete.txt'), 'utf8');
        console.log(newData);

        await fsPromises.writeFile(path.join(__dirname, 'files', 'read.txt'), 'This is a test.');

    } catch (err) {
        console.log(err);
    }
}
fileOps();


// Directory
if (!fs.existsSync('./new')) {
    fs.mkdir('./new', (err) => {
        if (err) throw err;
        console.log("Directory created")
    });
} else console.log('Directory already exists');

if (fs.existsSync('./new')) {
    fs.rmdir('./new', (err) => {
        if (err) throw err;
        console.log("Directory removed")
    });
}


process.on('uncaughtException', err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
});