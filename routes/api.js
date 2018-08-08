// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID});
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID});
const router = vertex.router();
const Park = require('../models/Park');
const Users = require('../models/users');
const ObjectId = require('mongoose').Types.ObjectId;


/*  This is a sample API route. */

router.get("/:resource", (req, res) => {
	// const model = models[req.params]
	console.log(req.query);
	const model = Park;
	if(model === null) {
		res.json({
			confirmation: "fail",
			message: "Resource not found"	
		});
		return;
	}

	let { latitude, longitude, latitudeDelta, longitudeDelta } = {
		latitude: '42.34891997150078',
  		latitudeDelta: '0.11785482460143015',
  		longitude: '-71.06724346666668',
  		longitudeDelta: '0.10000000000000853' 
	};
	latitude = parseFloat(latitude);
	longitude = parseFloat(longitude);
	latitudeDelta = parseFloat(latitudeDelta);
	longitudeDelta = parseFloat(longitudeDelta);

	const geo = {
		type: "Polygon",
		coordinates: [[
			[longitude, latitude],
			[longitude, latitude + latitudeDelta],
			[longitude + longitudeDelta, latitude + latitudeDelta],	
			[longitude + longitudeDelta, latitude],
			[longitude, latitude],
		]
	 ]
	};

	

	model.find({location: {$geoWithin: { $centerSphere: [ [ longitude, latitude ], 0.0013682683915108055 ]}}}, (err, data) => {
		res.json({
			confirmation: 'success',
			data,
		})
	})
	// model
	// .find()
	// .where("location")
	// .within(geo)
	// .exec(function(err, parks){
	// 	if (err) {
	// 		console.log(err);
	// 		res.json({
	// 			confirmation: "error",
	// 			message: err.message
	// 		})
	// 		return
	// 	}
	// 	res.json({
	// 		confirmation: "success",
	// 		data: parks
	// 	});
	// })
});

router.post('/park', (req,res,next)=>{
	const newPark = req.body || {};

	Park.create(newPark, (err, response)=>{
		if(err){
			return res.send(err)
		}

		res.send(response);
	})
})


router.get('/:resource/:id', (req, res) => {
	res.json({
		confirmation: 'success',
		resource: req.params.resource,
		id: req.params.id,
		query: req.query // from the url query string
	})
})

router.post('/users', (req, res, next) => {
	const newUser = req.body;

	console.log(req.body);

	if(!newUser.email || !newUser.password) {
		return next('Need email and password'); 
	}

	Users.create(newUser, function(err, resp){
		console.log(err, resp)

		if (err) {
			return next('User cannot created');
		}

		res.json(resp);
	});
})

router.post('/login', (req,res,next) => {
	const loginAttempt = req.body;
	let dbUser = {};

	Users.find({email: loginAttempt.email}, function(err, user){
		console.log(err)

		if(err) {
			return next('Cannot find that user')
		}
		dbUser = user[0];

		if (loginAttempt.password === dbUser.password) {
			// Authenticate and do something // next(dbUser)
			req.user = dbUser;
			return next()
		} else {
			res.send('Not Authenticated')
		}
	});


}, (req, res, next)=>{
	//res.send(req.user._id)
	console.log(req.user)
	const id = new mongoose.Types.ObjectId(req.user._ids);

	Park.find({user_id: id}, (err, parks) =>{
		if (err) {
			return next('No parks found');
		}
		res.json(parks)
	})

})

router.use((err, req,res,next)=>{
	res.send(err);
})


module.exports = router
