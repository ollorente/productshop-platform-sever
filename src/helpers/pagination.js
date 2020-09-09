module.exports = app = {
  limit: (params, amount) => {
    const Amount = amount ? Number(amount) : 20
    return params ? Number(params) : Amount
  },
  page: (params) => {
    return params ? (Number(params) - 1) * this.limit : 0
  }
}
