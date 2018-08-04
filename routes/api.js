// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const Park = require('../models/Park');

/*  This is a sample API route. */

router.get('/:resource', (req, res) => {
	// const model = models[req.params]
	const model = Park;
	if(model===null){
		res.json({
			confirmation: "fail",
			message: "Resource not found"	
		});
		return;
	}
		model.findOne({}, function(err, park) {
			if (err) {
				res.json({
					confirmation: "fail",
					message: "Resource not found"	
				});	
				return		
				} else {
				res.json({
					confirmation: 'success',
					data: park
				});
				return
				}
		});
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
