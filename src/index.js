const chalk = require('chalk')
require('./db')
const app = require('./app')

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`>>> ${chalk.blue('[PRODUCTSHOP] v1')} | Server on http://localhost:${port} <<<`)
})

module.exports = app