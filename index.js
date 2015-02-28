/*

Licence: MIT http://cpage.mit-license.org/

 */


module.exports = function(mongoose){
	// Private:
	var Grid = require('gridfs-stream');
	Grid.mongo = mongoose.mongo;
	var conn = mongoose.connection;
	// Public:
	conn.once("open",function(){

		return function(req, res, next){

			if(!req.is("multipart/form-data"))
				return next();

			if(!req.body)
				req.body = {};

			var files = [];

			var busboy = new (require("busboy"))({headers: req.headers});
			var gfs = Grid(conn.db);

			// Handle files. they will be automatically sent to GridFS with thier filename.
			// In req.body.files will be a array that contains the ID and filename of each file stored.
			busboy.on("file", function(fieldname, file, filename, encoding, mimetype){
				var writeStream = gfs.createWriteStream({filename:filename});
				file.pipe(writeStream);
				writeStream.on("close",function(file){
					files.push({_id:file._id,filename:file.filename});
				});
			});

			busboy.on("field",function(fieldname, val, fieldnameTruncated, valTruncated){
				req.body[fieldname] = val;
			});

			busboy.on('finish',function(){
				req.body.files = files;
				next();
			});
			req.pipe(busboy);
		};
	});
};