const url = require('url');
const fs = require('fs');
const path = require('path');
const cats = require('../data/cats.json');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    
    if(pathname === '/' && req.method === 'GET'){
        let filePath = path.normalize(
            path.join(__dirname, '../views/home/index.html')
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

            let modifiedCats = cats.map((cat) => 
            `<li>
                <img src="${path.join('./content/images/' + cat.image)}" alt="${cat.name}">
                <h3>${cat.name}</h3>
                <p><span>Breed: </span>${cat.breed}</p>
                <p><span>Description: </span>${cat.description}</p>
                <ul class="buttons">
                    <li class="btn edit" formmethod="GET"><a href="/cats-edit/${cat.id}">Change info</a></li>
                    <li class="btn delete" formmethod="GET"><a href="/shelter/${cat.id}">New home</a></li>
                </ul>
            </li>`);

            let modifiedData = data.toString().replace('{{cats}}', modifiedCats.join(""));

            res.writeHead(200, {
                "Content-type": "text/html"
            });
            
            res.write(modifiedData);
            res.end();
        });

    } else {
        return true;
    };
};
