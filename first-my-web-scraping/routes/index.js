const express = require('express');
const router = express.Router();
const axios = require( 'axios' );
const cheerio = require( 'cheerio' );

const url = 'https://epicentrk.ua/ua/shop/kraski/';


const getData = ( html ) => {
    const data = [];
    const $ = cheerio.load( html );
    $( '.product-Wrap' ).each( ( i, elem ) => {
        data.push( {
            title: $( elem ).find( '.card__name' ).text(),
            link: 'https://epicentrk.ua/'+$( elem ).find( '.card__name > a' ).attr( 'href' ),
            imgUrl: $( elem ).find( '.card__photo img' ).attr( 'src' ),
            options: $( elem ).find( '.card__characteristics' ).html(),
        } )
    } );
    console.log( data );
    return data;
};

const getItems = async ()=>{
    const items = await axios
        .get( url+'?sort=asc' )
        .catch( ( err ) => {
            console.log( err );
        } );

    return getData(items.data)
};



/* GET home page. */
router.get('/', async function(req, res, next) {
  //res.render('index', { title: 'Express' });
    const data = await getItems();
    //res.json(data);
    res.render('index', { title: 'First parsing', data: data });

});

module.exports = router;
