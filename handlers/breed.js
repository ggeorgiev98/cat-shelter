const url = require('url');
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    
    if(pathname === '/cats/add-cat' && req.method === 'GET'){
        let filePath = path.normalize(
            path.join(__dirname, '../views/addCat.html')
        );

        fs.readFile(filePath, (err, data) => {

            if(err) {
                console.log(err);
                
                res.writeHead(404, {
                    "Content-type": "text/plain"
                });
                    
                res.write("Error was found!");
                res.end();
                return;
            }
            
            res.writeHead(200, {
                "Content-type": "text/html"
            });
            
            res.write(data);
            res.end();
        });

    } else {
        return true;
    };
};