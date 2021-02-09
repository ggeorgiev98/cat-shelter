const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds.json');
const cats = require('../data/cats.json');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    let filepath;

    if (pathname === '/cats/add-cat' && req.method === 'GET') {
        filepath = path.normalize(path.join(__dirname, '../views/addCat.html'));
        const index = fs.createReadStream(filepath);

        index.on('data', (data) => {
            let catBreedPlaceHolder = breeds.map(breed => `<option value=${breed}>${breed}</option>`);
            let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceHolder);
            res.write(modifiedData);
        });

        index.on('end', () => {
            res.end();
        });

        index.on('error', (error) => {
            console.log(error);
        });
    } else if(pathname === '/cats/add-cat' && req.method === 'POST') {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if(err){throw err;};
            let oldPath = files.upload.path;
            let newPath = path.normalize(path.join('./content/images', files.upload.name));

            fs.rename(oldPath, newPath, error => {
                if(error) {throw error;};

                console.log("Files uploaded succesfully!");
            });
            
            fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }

                const allCats = JSON.parse(data);
                let newId = allCats.length + 1;
                if(allCats[-1].id == newId) {newId += 1};

                allCats.push({ id: newId, ...fields, image: files.upload.name });
                const json = JSON.stringify(allCats);

                fs.writeFile('./data/cats.json', json, () => {
                    res.writeHead(301, { location: '/' });
                    res.end();
                });
            });
        });
    } else if(pathname.includes('/cats-edit') && req.method === 'GET'){
        filepath = path.normalize(path.join(__dirname, '../views/editCat.html'));
        const index = fs.createReadStream(filepath);
        let catId = Number(pathname.split('/')[2]);
        let cat = cats.find(c => c.id === catId);

        index.on('data', (data) => {
            let modifiedData = data.toString().replace('{{id}}', catId);
            modifiedData = modifiedData.replace('{{name}}', cat.name);
            modifiedData = modifiedData.replace('{{description}}', cat.description);

            let breedsAsOptions = breeds.map((b) => `<option value=${b}>${b}</option>`)
            modifiedData = modifiedData.replace('{{catBreeds}}', breedsAsOptions.join('/'));

            modifiedData = modifiedData.replace('{{breed}}', cat.breed);
            res.write(modifiedData);
        });
        
        index.on('end', () => {
            res.end();
        });

        index.on('error', (error) => {
            console.log(error);
        });

    } else if(pathname.includes('/cats-edit') && req.method === 'POST'){
        const form = formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            let oldPath = files.upload.path;
            let newPath = path.normalize(path.join('./content/images', files.upload.name));
            let catId = Number(pathname.split('/')[2]); 
            let newImage = false;
            if(newPath.split("\\").length > 2) {
                newImage = true;
                fs.rename(oldPath, newPath, error => {
                    if(error) {throw error;};
                    console.log("Files uploaded succesfully!");
                });
            }
            
            fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }
                let allCats = JSON.parse(data);
                let index = allCats.findIndex(x => x.id == catId);

                let editedCat = { id: catId, ...fields }

                newImage 
                ? editedCat.image = files.upload.name
                : editedCat.image = allCats[index].image;
                allCats.splice(index, 1, editedCat);
                let json = JSON.stringify(allCats);
            
                fs.writeFile('./data/cats.json', json, "utf-8", (err) => { 
                    if(err) {throw err};

                    res.writeHead(301, { location: '/' });
                    res.end();
                });
            });
        });

    } else if(pathname.includes('/shelter') && req.method === 'GET'){
        filepath = path.normalize(path.join(__dirname, '../views/catShelter.html'));
        const index = fs.createReadStream(filepath);
        
        index.on('data', (data) => {
            let catId = Number(pathname.split('/')[2]);
            let shelterCat = cats.find(c => c.id === catId);
            let src = path.join('./content/images/' + shelterCat.image)
            let modifiedData = data.toString().replace('{{id}}', catId);
            modifiedData = modifiedData.replace('{{src}}', src)
            modifiedData = modifiedData.replace('{{name}}', shelterCat.name);
            modifiedData = modifiedData.replace('{{description}}', shelterCat.description);
            modifiedData = modifiedData.replace('{{breed}}', shelterCat.breed);
            res.write(modifiedData);
        });
        
        index.on('end', () => {
            res.end();
        });

        index.on('error', (error) => {
            console.log(error);
        });
    } else if(pathname.includes('/shelter') && req.method === 'POST'){
        const form = formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {          
            let catId = Number(pathname.split('/')[2]);
            
            
            fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }
                let allCats = JSON.parse(data);
                let index = allCats.findIndex(x => x.id == catId);
                allCats.splice(index, 1);
                let json = JSON.stringify(allCats);
            
                fs.writeFile('./data/cats.json', json, "utf-8", (err) => { 
                    if(err) {throw err};

                    res.writeHead(301, { location: '/' });
                    res.end();
                });
            });
        });
    } else {
        return true;
    };
}; 
