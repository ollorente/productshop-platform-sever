const request = require('supertest')
const app = require('../src/app')
const { User } = require('../src/models')

beforeEach(async () => {
    await User.deleteMany({})
})

describe('User methods', () => {
  test('Should create a user', async () => {
    const data = {
      displayName: 'test',
      email: 'test@test.com',
      password: 'Gd$123456'
    }

    await request(app)
        .post('/api/v1/register')
        .send(data)
        .expect(201)
  })

  test('List of users', done => {
    const data = {
        email: 'admin@admin.com',
        password: 'Cb740525$'
      }

    request(app)
        .post('/login')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(err => {
            if (err) return done(err)
            done()
        })

    request(app)
        .get('/users')
        .send('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
  })

  test('Detail a user', async done => {
    done()
  })

  test('Should update a user', async done => {
    done()
  })

  test('Should remove a user', async done => {
    done()
  })
})
