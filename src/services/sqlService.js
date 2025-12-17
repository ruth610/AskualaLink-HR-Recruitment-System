const db = require('../configs/db');
const fs = require('fs');

async function install(){
    // file path is not the same with the current directory
    const sqlFilePath = __dirname + '/../utils/schema.sql'
    let finalMessage = {};
    let queryList = [];
    let tempLine = '';
    const lines =  await fs.readFileSync(sqlFilePath, 'utf8').split('\n');
    const readFilePromise = new Promise((resolve, reject) => {
        //  read the file line by line
        lines.forEach((line) => {
            if (line.trim() === '' || line.trim().startsWith('--')) {
                return
            }
            tempLine += line;
            if (line.trim().endsWith(';')) {
                const query = tempLine.trim();
                queryList.push(query);
                tempLine = '';
            }
        });
        resolve("queries are added to the list");
    });

    for (let i = 0; i < queryList.length; i++) {
        if (queryList[i].trim() === '') {
            continue;
        }
        await db.query(queryList[i])
            .then((result) => {
                console.log('all tables are created');
            })
            .catch((error) => {
                finalMessage.message = 'no all tables are created';
            });
    }
    if(!finalMessage.message){
        finalMessage.message = 'all tables are created';
        finalMessage.status = 201;
    }
    else{
        finalMessage.status = 500;
    }
    return finalMessage;
}

module.exports = {
    install
}