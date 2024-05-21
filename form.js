import { createServer } from 'http';
import url from 'url';
import fs from 'fs';

const port = 3000;

const server = createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === "/"){
        fs.readFile('./form.html', (err, data) => {
            if (err){
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        })
    } else if (parsedUrl.pathname === '/submit' && req.method === 'POST') {
        let body = '';

        req.on('data', (chunk)=> {
            body += chunk
        });

        req.on('end', ()=>{
            const formData = new URLSearchParams(body);
            const first_name = formData.get('first_name');
            const last_name = formData.get('last_name');
            const other_names = formData.get('other_names');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const gender = formData.get('gender');

            const userInformation = [{
                "firstName": first_name,
                "lastName": last_name,
                "otherName": other_names,
                "email": email,
                "phone": phone,
                "gender": gender
            }];  
             append(userInformation)
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(`Your information has been saved successfully`)
        })
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});
           
function append(data) {
    fs.readFile('database.json', (err, fileData) => {
        if (err) {
            console.error('Error reading database file:', err);
            return;
        }
        let database = [];
        if (fileData.length > 0) {
            database = JSON.parse(fileData);
        }
        database.push(data);
        fs.writeFile('database.json', JSON.stringify(database, null, 2), err => {
            if (err) {
                console.error('Error writing to database file:', err);
                return;
            }
            console.log('Form data appended to database successfully.');
        });
    });
}

server.listen(port, () => {
    console.log(`listening on port: ${port}`)
});




