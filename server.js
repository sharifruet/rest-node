var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 6789; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://node:node@ds047940.mongolab.com:47940/bandhanhara'); // connect to our database
var Person     = require('./app/models/person');

// create our router
var router = express.Router();

//For all requests
router.use(function(req, res, next) {
	console.log('Something is happening.');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

//GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Great!!! Its working' });	
});

// route for /persons
router.route('/persons')
	.post(function(req, res) { 				//POST http://localhost:8080/persons
		
		var person = new Person();
		person.name = req.body.name;  	// person name (comes from the request)
		person.age = req.body.age;  	// person age (comes from the request)

		person.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Person Saved!' });
		});
		
	})
	.get(function(req, res) { 				//GET http://localhost:8080/api/persons
		Person.find(function(err, person) {
			if (err)
				res.send(err);

			res.json(person);
		});
	});

// Route for /person/:person_id
router.route('/person/:person_id')
	.get(function(req, res) {			// get the person with that id
		Person.findById(req.params.person_id, function(err, person) {
			if (err)
				res.send(err);
			res.json(person);
		});
	})
	.put(function(req, res) {			// update the person with this id
		Person.findById(req.params.person_id, function(err, person) {

			if (err)
				res.send(err);

			person.name = req.body.name;
			person.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Person updated!' });
			});

		});
	})
	.delete(function(req, res) {			// DELETE the person with this id
		Person.remove({
			_id: req.params.person_id
		}, function(err, person) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// Register Router
app.use('/api', router);

// Starting server
app.listen(port);
console.log('Server started ' + port);
