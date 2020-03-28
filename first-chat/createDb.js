// Mongoose
const mongoose = require( './libs/mongoose' );
const async = require( 'async' );
//const User = require( './models/user' ).User;

mongoose.set('debug',true);

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
], function ( err, results ) {
    console.log( 'results----', results );
    mongoose.disconnect();
    process.exit(err ? 255 : 0)
});


function open( callback ) {
    mongoose.connection.on( 'open', callback );
}

function dropDatabase( callback ) {
    const db = mongoose.connection.db;
    db.dropDatabase( callback );
}

function requireModels( _callback ) {
    require( './models/user' );

    async.each(Object.keys(mongoose.models), function ( modelName, callback ) {
        mongoose.models[modelName].ensureIndexes(callback)
    }, _callback)
}

function createUsers( _callback ) {

    const users = [
        { username: 'Вася', password: 'supervasya' },
        { username: 'Петя', password: '123' },
        { username: 'admin', password: 'thetruehero' }
    ];

    async.each(users, function ( userData, callback ) {
        const user = new mongoose.models.User(userData);
        user.save(callback)
    }, _callback)

/*    async.parallel( [
        function ( callback ) {
            const vasya = new User( { username: 'Вася', password: 'supervasya' } );
            vasya.save().then( ( res, err ) => {
                callback( err, vasya )
            } )
        },
        function ( callback ) {
            const petya = new User( { username: 'Петя', password: '123' } );
            petya.save().then( ( res, err ) => {
                callback( err, petya )
            } )
        },
        function ( callback ) {
            const admin = new User( { username: 'admin', password: 'thetruehero' } );
            admin.save().then( ( res, err ) => {
                callback( err, admin )
            } )
        }
    ], _callback );*/
}



console.log( 'OK' );



/*

// default connect Mongoose

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat', {useNewUrlParser: true, useUnifiedTopology: true});

const schema = mongoose.Schema({
    name: String
});

schema.methods.meow = function(){
    console.log(this.get('name'));
};

const Cat = mongoose.model('Cat', schema);

const kitty = new Cat({ name: 'Zildjian' });

//console.log("----h---f-",kitty);

kitty.save().then((res) => kitty.meow());*/


/*
// Native Node
const MongoClient = require('mongodb').MongoClient;

const test = require('assert');

// Connection url

const url = 'mongodb://localhost:27017/chat';

// Database Name

const dbName = 'test';
// Connect using MongoClient

MongoClient.connect(url, function(err, client) {

// Use the admin database for the operation

    const adminDb = client.db(dbName).admin();
// List all the available databases

    adminDb.listDatabases(function(err, dbs) {

        test.equal(null, err);

        test.ok(dbs.databases.length > 0);

        client.close();

    });

});
*/
