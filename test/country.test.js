const route = require('../src/routes')
const { Country } = require('../src/models')

describe.skip('/countries', () => {
  const data = {
    name: 'Wakanda',
    slug: 'wakanda',
    code: 'wk',
    currency: 'WKD',
    isActive: true
  }

  it('Should create country to database', async done => {
    const res = await route.post('/countries')
      .send(data)
    const country = await Country.findOne({ slug: 'wakanda' })
    expect(country.name).toBeTruthy()
    expect(country.slug).toBeTruthy()
    expect(country.code).toBeTruthy()
    expect(country.currency).toBeTruthy()
    expect(country.isActive).toBeTruthy()
    done()
  })
})
