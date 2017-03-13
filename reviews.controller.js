const responses = require('../models/responses')
const path = require('path')
const apiPrefix = '/api/customer/reviews'
const reviewModel = require('../models/review')
const reviewsService = require('../services/reviews.service')({
    modelService: reviewModel
})

module.exports = reviewsController

function reviewsController() {
    return {
        getAll,
        getOneById,
        insert,
        updateById,
        removeById,
        ping,
        getReviewsByCampaignId
    }

    function getReviewsByCampaignId(req, res) {
        let queryCondition = {
            campaign_id: req.params.id
        }
        reviewsService.getReviewsByCampaignId(queryCondition)
            .then((reviews) => {
                const responseModel = new responses.ItemsResponse()
                responseModel.items = reviews
                res.json(responseModel)
            })
            .catch((err) => {
                return res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function ping(req, res) {
        reviewsService.ping()
            .then((data) => {
                const responseModel = new responses.ItemResponse()
                responseModel.item = data
                res.json(responseModel)
            })
            .catch((err) => {
                res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function getAll(req, res) {
        reviewsService.getAll()
            .then((reviews) => {
                const responseModel = new responses.ItemsResponse()
                responseModel.items = reviews
                res.json(responseModel)
            }).catch((err) => {
                res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function getOneById(req, res) {
        let queryCondition = {
            _id: req.params.id
        }

        reviewsService.getOne(queryCondition)
            .then((review) => {
                const responseModel = new responses.ItemResponse()
                responseModel.item = review
                res.json(responseModel)
            })
            .catch((err) => {
                return res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function insert(req, res) {
        reviewsService.insert(req.body)
            .then((review) => {
                const responseModel = new responses.ItemResponse()
                responseModel.item = review
                res.status(201)
                    .location(path.join(apiPrefix, review._id.toString()))
                    .json(responseModel)
            })
            .catch((err) => {
                return res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function updateById(req, res) {
        let queryCondition = {
            _id: req.params.id
        }
        reviewsService.updateOne(queryCondition, req.body)
            .then((review) => {
                const responseModel = new responses.ItemResponse()
                res.status(201)
                    .json(responseModel)
            })
            .catch((err) => {
                return res.status(500).send(new responses.ErrorResponse(err.stack))
            })
    }

    function removeById(req, res) {
        let queryCondition = {
            _id: req.params.id
        }
        reviewsService.removeOne(queryCondition)
            .then((review) => {
                const responseModel = new responses.ItemResponse()
                responseModel.item = review
                res.json(responseModel)
            })
            .catch((err) => {
                return res.status(500).send(new responses.ErrorResponse(err))
            })
    }
}
