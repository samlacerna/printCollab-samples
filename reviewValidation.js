const util = require('util')

module.exports = {
    validateReviewParams
}

function validateReviewParams(req, res, next) {
    req.checkBody('title', 'Title is Required').notEmpty()
    req.checkBody('content', 'Content is Required').notEmpty()
    req.checkBody('rating', 'Rating is Required and must be a rating from 1 to 5').notEmpty().isInt({
        min: 1,
        max: 5
    })
    req.getValidationResult()
        .then(function(errors) {
            if (!errors.isEmpty()) {
                res.status(400).send('There have been validation errors: ' + util.inspect(errors.array()))
                return
            }
            next()
        })
}
