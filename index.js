/*

Licence: MIT http://cpage.mit-license.org/

 */


module.exports = function(options){
	// Private:
	var Grid = require('gridfs-stream');
	var conn;
	if(options.mongoose){
		Grid.mongo = options.mongoose.mongo;
		conn = options.mongoose.connection;
	}else{
		Grid.mongo = options.mongo;
		conn = {db:options.db};
	}
	// Public:
	return function(req, res, next){
		if(!options.mongoose || conn.readyState == 1){
			if(!req.is("multipart/form-data"))
				return next();

			if(!req.body)
				req.body = {};

			var files = [];
			var streams = [];
			var streams_response = 0;

			var busboy = new (require("busboy"))({headers: req.headers});
			var gfs = Grid(conn.db);

			// Handle files. they will be automatically sent to GridFS with thier filename.
			// In req.body.files will be a array that contains the ID and filename of each file stored.
			busboy.on("file", function(fieldname, file, filename, encoding, mimetype){
				var writeStream = gfs.createWriteStream({filename:filename});
				file.pipe(writeStream);
				streams.push(writeStream);
				streams_response++;
			});

			//Parses fields in the normal req.body way.
			busboy.on("field",function(fieldname, val, fieldnameTruncated, valTruncated){
				req.body[fieldname] = val;
			});

			busboy.on('finish',function(){
				req.body.files = files;
				streams.forEach(function(e,i){
					e.on("close",function(file){
						files.push({_id:file._id,filename:file.filename});
						streams_response--;
						if(streams_response === 0){
							next();
						}
					});
				});
			});
			req.pipe(busboy);
		}
	};
};