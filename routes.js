module.exports = function (app) {
	
	app.get('/path', function(req, res) {
		console.log('Path required. Sending...');
		console.log("HOST --> " + process.env.HOST);
		res.send(process.env.HOST);
	});

    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); 
    });
};