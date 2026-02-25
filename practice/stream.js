const fs = require('fs');

const rs = fs.createReadStream('files/lorem.txt', 'utf8');

const ws = fs.createWriteStream('files/new-lorem.txt');

rs.on('data', (dataChunk) => {
    ws.write(dataChunk);
});

// More efficient way than listening
rs.pipe(ws);