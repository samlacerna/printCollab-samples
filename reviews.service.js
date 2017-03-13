module.exports = reviewsService

function reviewsService(options) {
    let Review

    if (!options.modelService) {
        throw new Error('Options.modelService is required')
    }

    Review = options.modelService

    return {
        ping,
        getAll,
        getOne,
        insert,
        updateOne,
        removeOne,
        getReviewsByCampaignId
    }

    function getReviewsByCampaignId(queryCondition) {
        return Review.find(queryCondition)
    }

    function ping() {
        return new Promise(function(resolve, reject) {
            resolve('pong')
        })
    }

    function getAll() {
        return Review.find()
    }

    function getOne(queryCondition) {
        return Review.findOne(queryCondition)
    }

    function insert(document) {
        let review = new Review(document)
        return review.save()
    }

    function updateOne(queryCondition, doc) {
        return Review.findOneAndUpdate(queryCondition, doc, {
            new: true
        })
    }

    function removeOne(queryCondition) {
        return Review.findOneAndRemove(queryCondition)
    }
}
