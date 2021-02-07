const url = require('url');
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    
    if (pathname === '/cats/add-breed' && req.method === 'GET') {
        filepath = path.normalize(path.join(__dirname, '../views/addBreed.html'));
        const index = fs.createReadStream(filepath);

        index.on('data', (data) => {
            res.write(data);
        });
        
        index.on('end', () => {
            res.end();
        });

        index.on('error', (error) => {
            console.log(error);
        });

    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
        let rawData = "";

        req.on('data', (data) => {
            rawData += data;
        });

        req.on('end', () => {
            let body = qs.parse(rawData);

            fs.readFile('./data/breeds.json', (err, data) => {
                if(err){
                    throw err;
                }

                let breeds = JSON.parse(data);
                breeds.push(body.breed);
                let json = JSON.stringify(breeds);

                fs.writeFile('./data/breeds.json', json, 'utf-8', () => {
                    console.log(`The breed was uploaded succesfully.`)
                    res.writeHead(301, { location: '/' });
                    res.end();
                });
            });
        });
    } else {
        return true;
    };
};