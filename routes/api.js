// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID});
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID});
const router = vertex.router();
const Park = require('../models/Park');

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

	model
	.find()
	.where("location")
	.within(geo)
	.exec(function(err, parks){
		if (err) {
			console.log(err);
			res.json({
				confirmation: "error",
				message: err.message
			})
			return
		}
		res.json({
			confirmation: "success",
			data: parks
		});
	})

		// model.findOne({}, function(err, park) {
		// 	if (err) {
		// 		res.json({
		// 			confirmation: "fail",
		// 			message: "Resource not found"	
		// 		});	
		// 		return;		
		// 		} else {
		// 		res.json({
		// 			confirmation: "success",
		// 			data: park
		// 		});
		// 		return;
		// 		}
		// });
});

router.get('/:resource/:id', (req, res) => {
	res.json({
		confirmation: 'success',
		resource: req.params.resource,
		id: req.params.id,
		query: req.query // from the url query string
	})
})



module.exports = router
