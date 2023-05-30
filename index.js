const superagent = require('superagent');
const mysql = require('mysql');

const http = require('http');

const server = http.createServer((req, res) => {
    // console.log(req.url);
    // console.log(url.parse(req.url, true));

    // const pathName = req.url;
    const {query, pathname: pathName} = url.parse(req.url, true);
    // console.log(pathName);
    // Overview page
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });

        const cardsHtml = dataObj
            .map((el) => replaceTemplate(tempCard, el))
            .join('');
        console.log(cardsHtml);
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);

        // Product page
    } else if (pathName === '/product') {
        console.log(query);
        const product = dataObj[query.id];
        res.writeHead(200, {
            'Content-type': 'text/html',
        });
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

        // API
    } else if (pathName === '/api') {
        // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
        //     const productData = JSON.parse(data);
        //     console.log(productData);
        //     res.writeHead(200, {
        //         'Content-type': 'application/json',
        //     });
        //     res.end(data);
        // });

        res.writeHead(200, {
            'Content-type': 'application/json',
        });
        res.end(data);

        // Not found
    } else {
        // De esta forma enviamos encabezados HTTP
        // Un encabezado HTTP es basicamente una información sobre la respuesta que estamos enviando
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world',
        });
        res.end('Page not found!');
    }
});

server.listen(80, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});


var con = mysql.createConnection({
    host: 'mysql.test.novacasahn.com',
    user: 'novacasatech',
    password: 'abc123def',
    database: 'test_novacasahn_com'
});

// con.connect(function (err) {
//     if (err) throw err;
//     console.log('Connected!');
// });


con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT t.* FROM test_novacasahn_com.wp_d3d8n7_posts t where t.post_type = 'property' and post_status='publish'", function (err, result, fields) {
      if (err) throw err;
      console.log(result[0].post_content);
    });
  });

const getProperties = async () => {
    try {
        const request = await superagent.get(
            `https://novacasahn.com/wp-json/wp/v2/properties`
        );
        const propertiesQuantity = request.header['x-wp-total'];

        let posts = [];
        console.log(Math.ceil(propertiesQuantity / 100));
        for (let i = 0; i < Math.ceil(propertiesQuantity / 100); i++) {
            const properties = await superagent.get(
                `https://novacasahn.com/wp-json/wp/v2/properties?page=${
                    i + 1
                }&per_page=100`
            );
            posts.push(...properties.body);
        }

        console.log(propertiesQuantity);
        // const properties = await superagent.get(
        //     `https://test.novacasahn.com/wp-json/wp/v2/properties?per_page=100`
        // );
        // const data = properties.body;
        // const posts1 = [...data];
        console.log(posts[15]);
    } catch (err) {
        console.log(err);
        throw err;
    }
};
getProperties();
