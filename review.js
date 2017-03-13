/* global it, describe, beforeEach, before */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const server = require('../server')
const Review = require('../app/models/review')
const User = require('../app/models/user')

const chai = require('chai')
chai.should()
chai.use(require('chai-http'))
chai.use(require('chai-json-schema'))

// https://spacetelescope.github.io/understanding-json-schema/
const successResponseSchema = {
    title: 'json schema v1',
    type: 'object',
    required: ['isSuccessful'],
    properties: {
        isSuccessful: {
            type: 'boolean'
        }
    }
}

// create agent for tests
const agent = chai.request.agent(server)

// Our parent block
describe('Reviews', () => {
    // Before each test we empty the database
    beforeEach(done => {
        Review.remove({}, (err, user) => {
            if (err) {
                return done(err)
            }
            done()
        })
    })
    // Before tests we register new user
    before(done => {
        User.remove({}, err => {
            if (err) {
                return done(err)
            }
            let user = {
                email: 'kimmy@email.com',
                password: 'password',
                username: 'kimmy'
            }
            agent.post('/api/users/register')
                .send(user)
                .then(res => {
                    done()
                })
                .catch(reason => {
                    return done(reason)
                })
        })
    })

    /*
     * Test the /GET route
     */
    describe('/GET Reviews', () => {
        it('should GET all the Reviews', done => {
            agent.get('/api/customer/reviews')
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    res.should.have.status(200)
                    res.body.should.be.jsonSchema(successResponseSchema)
                    res.body.items.length.should.be.eql(0)
                    done()
                })
        })
    })

    /*
     * Test the /POST route
     */
    describe('/POST Reviews', () => {
        it('should POST a Review', done => {
            let review = {
                rating: 5,
                title: 'Review Title',
                content: 'Review Content'
            }

            agent.post('/api/customer/reviews')
                .send(review)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    res.should.have.status(201)
                    res.should.have.header('location')
                    res.body.should.be.a('object')
                    res.body.should.be.jsonSchema(successResponseSchema)
                    res.body.should.have.property('item')
                    res.body.should.have.property('item').that.has.property('rating', 5)
                    res.body.should.have.property('item').that.has.property('title', 'Review Title')
                    res.body.should.have.property('item').that.has.property('content', 'Review Content')
                    done()
                })
        })
    })

    /*
     * Test the /GET/:id route
     */
    describe('/GET/:id reviews', () => {
        it('should GET a review by the given id', done => {
            let review = new Review({
                rating: '4',
                title: 'Title',
                content: 'Content'
            })
            review.save()
                .then(campaign => {
                    agent.get('/api/reviews/' + review.id)
                        .end((err, res) => {
                            if (err) {
                                return done(err)
                            }
                            res.should.have.status(200)
                            res.body.should.be.a('object')
                            res.body.should.have.property('item')
                            res.body.should.have.property('item').that.has.property('title', 'Title')
                            res.body.should.have.deep.property('item._id', review.id)
                            done()
                        })
                })
                .catch(reason => {
                    return done(reason)
                })
        })
    })

        /*
     * Test the /PUT/:id route
     */
    describe('/PUT/:id Reviews', () => {
        it('should UPDATE a Review given the id', done => {
            let review = new Review({
                rating: 3,
                title: 'Luna Grill Sucks',
                content: 'Dont ever go there'
            })
            review.save()
                .then(review => {
                    let reviewUpdate = {
                        rating: 2,
                        title: 'Luna Grill Sucks',
                        content: 'Dont ever ever go there'
                    }
                    agent.put('/api/customer/reviews/' + review.id)
                        .send(reviewUpdate)
                        .end((err, res) => {
                            if (err) {
                                return done(err)
                            }
                            res.should.have.status(201)
                            done()
                        })
                })
                .catch(reason => {
                    return done(reason)
                })
        })
    })

        /*
     * Test the /DELETE/:id route
     */
    describe('/DELETE/:id Reviews', () => {
        it('should DELETE a Review given the id', done => {
            let review = new Review({
                rating: 4,
                title: 'Fish Grill is awesome',
                content: 'You should go there'
            })
            review.save()
                .then(review => {
                    agent.delete('/api/customer/reviews/' + review.id)
                        .end((err, res) => {
                            if (err) {
                                return done(err)
                            }
                            res.should.have.status(200)
                            res.body.should.be.a('object')
                            res.body.should.be.jsonSchema(successResponseSchema)
                            res.body.should.have.property('item')
                            res.body.should.have.deep.property('item._id', review.id)
                            done()
                        })
                })
                .catch(reason => {
                    return done(reason)
                })
        })
    })
})
