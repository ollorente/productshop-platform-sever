require('./db')
const app = require('./app')

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`>>> [PRODUCTSHOP] v1 | Server on http://localhost:${port} <<<`)
})
