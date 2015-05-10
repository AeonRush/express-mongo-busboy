# express-mongo-busboy

A elegant way of storing file uploads into GridFS from mongo or mongoose.


## Quick Use
	var mongoose = require("mongoose");

	... Models, Schemas, etc.
	mongoose.connect('mongodb://localhost/mydb');
	var emb = require("express-mongo-busboy")({mongoose:mongoose});

	app.post("/uploads",emb,function(req,res){
		console.log(req.body.files); // {upload:{id:54f26081d2790e802f741c3a,filename:'myupload.jpg'}}
		console.log(req.body.myOtherField) // "Hello World"
	});

### Client Side

	<form method="post",enctype="multipart/form-data">
		<input type="file" name="upload" />
		<input type="text" name="myOtherField" />  
		<button type="submit"> Submit </button>
	</form>


## Options

**mongoose:** Use a already initialized mongoose connection. This is the only required option to pass if you are using mongoose.

**mongo:** Use a native mongoDb driver, must specify the Mongo.Db using the **db** option.

**db:** This is to specify the connected database when using a native mongo client.

More options like extension rejection, file number limiting, and file size will becoming in the future, for now these are the only ones.


## Licence and Contributing

This is licensed under the MIT licence: http://cpage.mit-license.org/

Feel free to make a pull request or open up any issues. If anything needs to be finagled with!
