exports.post = function ( req, res, next ) {

    const sid = req.session.id;
    const io = req.app.get('io');

    req.session.destroy(function ( err ) {
        /*io.sockets.emit("session:reload", sid);*/
        io.sockets._events.sessionreload(sid);

        console.log("testEvent------",sid);
        if (err) return next(err);
        res.redirect('/');
    });

};
