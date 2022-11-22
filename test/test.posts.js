require('dotenv').config();
process.env.node_env = 'test';

const server = require('../server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secrets = require('../Config/config.secrets');
const { createNewPost } = require('../Controllers/posts');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const { createUser } = require('../Controllers/users');

chai.use(chaiHttp);
describe('Users Endpoint Tests -- ', () => {
    let userToken;
    let adminToken;
    let userID;
    beforeEach((done) => {
        mongoose.connection.collections.posts.drop(() => {
            done();
        });
    });
    beforeEach((done) => {
        mongoose.connection.collections.users.drop(() => {
            done();
        });
    });

    beforeEach((done) => {
        const user = {
            email: 'ahmed@deal.com',
            password: 'ahmed123',
        };
        createUser(user).then((d) => {
            expect(d).to.have.property('password');
            userID = d._id;
            userToken = jwt.sign(
                { _id: d._id, email: d.email },
                secrets.jwt_password
            );
            done();
        });
    });
    beforeEach((done) => {
        const admin = {
            email: 'admin@deal.com',
            password: 'deal123',
            role: 'ADMIN',
        };
        createUser(admin).then((d) => {
            expect(d).to.have.property('password');
            adminToken = jwt.sign(
                { _id: d._id, email: d.email },
                secrets.jwt_password
            );
            done();
        });
    });

    describe('Posts Creation', () => {
        it('Creates a Post without auth', (done) => {
            const post = {
                title: 'Hello',
                body: 'world !!',
            };
            chai.request(server)
                .post('/posts/')
                .send(post)
                .end((err, res) => {
                    expect(res.status).to.be.eq(401);

                    done();
                });
        });

        it('Creates a Post with Admin Auth', (done) => {
            const post = {
                title: 'Hello',
                body: 'world !!',
            };
            chai.request(server)
                .post('/posts/')
                .send(post)
                .auth(adminToken, { type: 'bearer' })
                .end((err, res) => {
                    expect(res.status).to.be.eq(400);
                    expect(res.body.message).to.be.eq(
                        'Users only can Create Posts'
                    );

                    done();
                });
        });

        it('Creates a Post with auth, status PENDING', (done) => {
            const post = {
                title: 'Hello',
                body: 'world !!',
            };
            chai.request(server)
                .post('/posts/')
                .auth(userToken, { type: 'bearer' })
                .send(post)
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.newPost.status).to.be.eq('PENDING');

                    done();
                });
        });

        it('Creates a Post with no body', (done) => {
            const post = {
                title: 'Hello',
            };
            chai.request(server)
                .post('/posts/')
                .auth(userToken, { type: 'bearer' })
                .send(post)
                .end((err, res) => {
                    expect(res.status).to.be.eq(400);

                    done();
                });
        });
    });

    describe('Posts Listing', () => {
        beforeEach((done) => {
            const post = {
                title: 'Hello',
                body: 'world !!',
            };
            createNewPost(post, userID).then(() => done());
        });

        beforeEach((done) => {
            const post = {
                title: 'Hello',
                body: 'world !!',
                status: 'APPROVED',
            };
            createNewPost(post, userID).then(() => done());
        });

        it('Lists posts for an Admin', (done) => {
            chai.request(server)
                .get('/posts/')
                .auth(adminToken, { type: 'bearer' })
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.data.length).to.be.eq(2);

                    done();
                });
        });

        it('Lists posts for a User', (done) => {
            chai.request(server)
                .get('/posts/')
                .auth(userToken, { type: 'bearer' })
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.data.length).to.be.eq(1);
                    expect(res.body.data[0].status).to.be.eq('APPROVED');
                    done();
                });
        });

        it('does not list posts for un auth users', (done) => {
            chai.request(server)
                .get('/posts/')
                .end((err, res) => {
                    expect(res.status).to.be.eq(401);

                    done();
                });
        });
    });
});
