/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../models/user');
const server = require('../index');

chai.use(chaiHttp);
const should = chai.should();
let token;

describe('User', () => {
  before((done) => {
    User.remove({}, () => {
      done();
    });
  });

  after((done) => {
    User.remove({}, () => {
      done();
    });
  });
  describe('Create a new user', () => {
    it('it should create a new user', (done) => {
      const user = {
        name: 'Ujjwal Suman',
        email: 'ujjwal007@gmail.com',
        password: '123456',
      };
      chai
        .request(server)
        .post('/api/v1/user/sign-up')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status', true);
          done();
        });
    });
  });

  describe('Create user with duplicate data', () => {
    it('it should not allow duplicate email', (done) => {
      const user = {
        name: 'Ujjwal Suman',
        email: 'ujjwal007@gmail.com',
        password: '123456',
      };
      chai
        .request(server)
        .post('/api/v1/user/sign-up')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status', false);
          res.body.should.have.property('message', 'User already exists');
          done();
        });
    });
  });

  describe('Invalid Email at the time of login', () => {
    it('it should not authenticate user because of invalid email', (done) => {
      const user = {
        email: 'ujjwal@gmail.com',
        password: '123456',
      };
      chai
        .request(server)
        .post('/api/v1/user/sign-in')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status', false);
          res.body.should.have.property(
            'message',
            'email/password is incorrect',
          );
          done();
        });
    });
  });

  describe('Invalid Password at the time of login', () => {
    it('it should not authenticate user because of invalid password', (done) => {
      const user = {
        email: 'ujjwal007@gmail.com',
        password: '12345',
      };
      chai
        .request(server)
        .post('/api/v1/user/sign-in')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status', false);
          res.body.should.have.property(
            'message',
            'password/email is incorrect',
          );
          done();
        });
    });
  });

  describe('Authenticate user', () => {
    it('it should authenticate user and provide user\'s token', (done) => {
      const user = {
        email: 'ujjwal007@gmail.com',
        password: '123456',
      };
      chai
        .request(server)
        .post('/api/v1/user/sign-in')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', true);
          token = res.body.token;
          done();
        });
    });
  });

  describe('get user by email id', () => {
    it('it should return user by email id', (done) => {
      chai
        .request(server)
        .get('/api/v1/user/getUserByEmail/ujjwal007@gmail.com')
        .set({
          'x-access-token': token,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status', true);
          done();
        });
    });
  });
});
