const config = require('../config');
const connect = require('connect');
const async = require('async');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const sessionStore = require('../libs/sessionStore');
const createError = require('http-errors');
const User = require('../models/user').User;

function loadSession( sid, callback ) {

    sessionStore.load(sid, function(err, session) {

        if (arguments.length == 0) {
            // no arguments => no session
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });
}

function loadUser(session, callback){

    if(!session.user){
        //console.error('Session %s is anonymous', session.id);
        return callback(null, null);
    }

    User.findById(session.user, function ( err, user ) {

        if(err) return callback(err);

        if(!user){
            return callback(null, null);
        }

        callback(null, user);
    })
}


module.exports = function(server) {
    const io = require('socket.io').listen(server);
    io.set('origins', 'http://localhost:*');

    io.use(function(socket, next) {
        const handshakeData = socket.request;

        async.waterfall([
            function(callback) {

                handshakeData.cookies = cookie.parse(handshakeData.headers.cookie || '');
                const sidCookie = handshakeData.cookies[config.get('session:key')];
                const sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));

                loadSession(sid, callback)
            },
            function(session, callback) {

                if(!session){
                    callback(createError(401,"No session"))
                }

                socket.handshake.session = session;
                loadUser(session, callback)
            },
            function(user, callback) {

                if(!user){
                    callback(createError(403,"Anonymous session may not connect"))
                }
                socket.handshake.user = user;


                callback(null)
            }
        ], function (err, result) {

            next(err);
        });

    });



    io.on("sessionreload", function(sid) {
        //let sessionClient = {handshake:{session:{id:0}}};
        io.clients((error, clients) => {
            if (error) throw error;
            console.log('clients------',sid, clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
            clients.forEach(function(client) {
                clients.emit("logout");
                //console.log('client.handshake.session.id------',client);
                if (client !== sid) return;

                loadSession(sid, function(err, session) {
                    if (err) {
                        clients.emit("error", "server error");
                        clients.disconnect();
                        return;
                    }

                    if (!session) {
                        clients.emit("logout");
                        clients.disconnect();
                        return;
                    }

                    //sessionClient = session;
                });

            });
        });

       //console.log("=======clients------",sid, clients)

/*        clients.forEach(function(client) {
            if (client.handshake.session.id !== sid) return;

            loadSession(sid, function(err, session) {
                if (err) {
                    client.emit("error", "server error");
                    client.disconnect();
                    return;
                }

                if (!session) {
                    client.emit("logout");
                    client.disconnect();
                    return;
                }

                client.handshake.session = session;
            });

        });*/

    });

    io.sockets.on('connection', function(socket) {

        let username = '';

        if (socket.handshake.user) {
            username = socket.handshake.user.username;
        }

        socket.broadcast.emit('join',username);

        socket.on('message', function(text, cb) {
            socket.broadcast.emit('message',username, text);
            cb && cb();
        });

        socket.on('disconnect', function() {
            socket.broadcast.emit('leave', username);
        });

    });

/*    io.sockets.on('connection', function(socket) {

        socket.on('message', function(text, cb) {
            socket.broadcast.emit('message', text);
            cb && cb();
        });

    });*/

return io;
};
