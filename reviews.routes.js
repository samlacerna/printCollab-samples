const router = require('express').Router()
const reviewsController = require('../controllers/reviews.controller')()
const reviewValidation = require('../middleware/reviewValidation')
const {cache} = require('../../config/apicache')
module.exports = router

// api routes ===========================================================
router.get('/ping', reviewsController.ping)
router.get('/', cache.middleware(), reviewsController.getAll)
router.get('/:id', reviewsController.getOneById)
router.get('/campaign/:id', cache.middleware(), reviewsController.getReviewsByCampaignId)
router.post('/', reviewValidation.validateReviewParams, reviewsController.insert)
router.put('/:id', reviewValidation.validateReviewParams, reviewsController.updateById)
router.delete('/:id', reviewsController.removeById)

