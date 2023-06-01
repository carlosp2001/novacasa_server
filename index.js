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

        console.log(query.id);
        if (query.id) {
            // const res = await superagent.get(
            //     `https://test.novacasahn.com/wp-json/wp/v2/properties/${query.id}`
            //     );

            con.query(
                `SELECT t.* FROM test_novacasahn_com.wp_d3d8n7_posts t where t.post_type = 'property' and post_status='publish' and t.ID=${query.id} LIMIT 1`,
                function (err, result, fields) {
                    if (err) throw err;
                    let resultArray = Array.from(result);
                    let html = resultArray[0].post_content;

                    con.query(
                        `SELECT t.* FROM test_novacasahn_com.wp_d3d8n7_postmeta t where t.post_id = ${query.id} LIMIT 501`,
                        async (err, result) => {
                            let resultMetaArray = Array.from(result);
                            let currencyMeta = resultMetaArray.find(
                                (el) => el.meta_key == 'fave_currency'
                            );
                            let priceMeta = resultMetaArray.find(
                                (el) => el.meta_key == 'fave_property_price'
                            );
                            const [img, ...altImgs] = await getImages(
                                Array.from(
                                    resultMetaArray.filter(
                                        (el) =>
                                            el.meta_key ==
                                            'fave_property_images'
                                    )
                                )
                            );

                            let name = resultArray[0].post_title;
                            let image_url = img;
                            let availability = 'in stock';
                            let retailer_id = resultArray[0].ID;
                            let url = resultArray[0].guid;
                            let brand = 'Novacasa';
                            let currency = currencyMeta.meta_value;
                            let description = html.replace(/<[^>]+>/g, '');
                            let price = priceMeta.meta_value;
                            let additional_image_urls = altImgs;

                            superagent
                                .post(
                                    'https://graph.facebook.com/v17.0/198639315962847/products'
                                )
                                .query({
                                    access_token:
                                        'EAAJWZBDFSBdgBAM3Hx2vuoPVFTYBZATZAizSnpZCfn7qyxxEUPXZBc3jv8MfZCDwVI88urMu9UR8fLXPqDJcFELTqdtr5fC7IZAPYoxFy8RzHvNO4Ny9EnAdXc98AP0TeZAYnchTxaB8rkRWIpZBRDu7U28nnkR1aIPvp8SEzTiP3IwZDZD',

                                })
                                .send({
                                    name,
                                    image_url,
                                    availability,
                                    retailer_id,
                                    url,
                                    brand,
                                    currency,
                                    description,
                                    price,
                                    additional_image_urls,
                                }) // sends a JSON post body
                                .set('X-API-Key', 'foobar')
                                .set('accept', 'json')
                                .end((err, res) => {
                                    // Calling the end function will send the request
                                    if (err) console.log(err);
                                    console.log(res);
                                });

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
