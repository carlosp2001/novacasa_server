const superagent = require('superagent');
const mysql = require('mysql');
const url = require('url');

const http = require('http');

var con = mysql.createConnection({
    host: 'mysql.test.novacasahn.com',
    user: 'novacasatech',
    password: 'abc123def',
    database: 'test_novacasahn_com',
});

con.connect(function (err) {
    if (err) throw err;
    console.log('Connected!');
});

const server = http.createServer((req, res) => {
    // console.log(req.url);
    // console.log(url.parse(req.url, true));

    // const pathName = req.url;
    const {query, pathname: pathName} = url.parse(req.url, true);
    // console.log(pathName);
    // Overview page
    if (pathName === '/') {
        getImages = async (imageArray) => {
            let promiseArray = await imageArray.map((el) =>
                superagent.get(
                    `https://test.novacasahn.com/wp-json/wp/v2/media/${el.meta_value}`
                )
            );
            const all = await Promise.all(promiseArray);
            const imgs = all.map((el) => el.body.source_url);
            return imgs;
        };

        res.writeHead(200, {
            'Content-type': 'text/html',
        });
        console.log(query);

                            res.end('<h1>Hola</h1>');
                        }
                    );
                }
            );
        }
    }
});

server.listen(8080, () => {
    console.log('Listening to requests on port 8080');
});

// const getProperties = async () => {
//     try {
//         const request = await superagent.get(
//             `https://novacasahn.com/wp-json/wp/v2/properties`
//         );
//         const propertiesQuantity = request.header['x-wp-total'];

//         let posts = [];
//         console.log(Math.ceil(propertiesQuantity / 100));
//         for (let i = 0; i < Math.ceil(propertiesQuantity / 100); i++) {
//             const properties = await superagent.get(
//                 `https://novacasahn.com/wp-json/wp/v2/properties?page=${
//                     i + 1
//                 }&per_page=100`
//             );
//             posts.push(...properties.body);
//         }

//         console.log(propertiesQuantity);
//         // const properties = await superagent.get(
//         //     `https://test.novacasahn.com/wp-json/wp/v2/properties?per_page=100`
//         // );
//         // const data = properties.body;
//         // const posts1 = [...data];
//         console.log(posts[15]);
//     } catch (err) {
//         console.log(err);
//         throw err;
//     }
// };
// getProperties();
