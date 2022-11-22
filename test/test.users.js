require('dotenv').config();
process.env.node_env = 'test';

const { createUser } = require('../Controllers/users');
const server = require('../server');
const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Users Endpoint Tests -- ', () => {
    beforeEach((done) => {
        mongoose.connection.collections.users.drop(() => {
            done();
        });
    });

    describe('User Creation', () => {
        it('creates user with USER role as default', (done) => {
            const body = {
                email: 'ahmed@deal.com',
                password: 'ahmed123',
            };
            chai.request(server)
                .post('/user/signup/')
                .send(body)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('user');
                    expect(res.body.user.role).to.be.equal('USER');
                    done();
                });
        });

        it('creates user with ADMIN role ', (done) => {
            const body = {
                email: 'admin@deal.com',
                password: 'deal123',
                role: 'ADMIN',
            };

            chai.request(server)
                .post('/user/signup/')
                .send(body)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('user');
                    expect(res.body.user.role).to.be.equal('ADMIN');
                    done();
                });
        });

        it('creates a user without a password', (done) => {
            const body = {
                email: 'user@user.com',
            };

            chai.request(server)
                .post('/user/signup')
                .send(body)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    done();
                });
        });
    });

    describe('User Log in', () => {
        beforeEach((done) => {
            const user = {
                email: 'ahmed@deal.com',
                password: 'ahmed123',
            };
            createUser(user).then((d) => {
                expect(d).to.have.property('password');
                done();
            });
        });
        it('Logs in with registered user', (done) => {
            const user = {
                email: 'ahmed@deal.com',
                password: 'ahmed123',
            };
            chai.request(server)
                .post('/user/login/')
                .send(user)
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body).to.be.a('string');
                    done();
                });
        });

        it('Logs in with registered user -- Wrong Pass', (done) => {
            const user = {
                email: 'ahmed@deal.com',
                password: 'wrongpass',
            };
            chai.request(server)
                .post('/user/login/')
                .send(user)
                .end((err, res) => {
                    expect(res.status).to.be.eq(400);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message');

                    done();
                });
        });

        it('Logs in with un registered user', (done) => {
            const user = {
                email: 'mohammed@deal.com',
                password: 'mohammed123',
            };

            chai.request(server)
                .post('/user/login/')
                .send(user)
                .end((err, res) => {
                    expect(res.status).to.be.eq(400);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.eq('User does not exist !!');

                    done();
                });
        });
    });
});
