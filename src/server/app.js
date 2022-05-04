// TODO: move API to Rust lang back-end for release v2
const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 8000

app.use(express.static(path.resolve(__dirname, '../client/build')))

app.get('/api/v1/calendar', (req, res) => {
  res.sendFile(
    `${req.query.name}.ics`,
    {
      root: __dirname.replace('server', 'bots/discord/calendar')
    },
    err => {
      if (err) {
        throw err
      }
    })
})

app.get('/', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html')))

const API = () => {
  app.listen(port, () => {
    console.log(`Web App is running on ${process.env.URL}`)
  })
}

module.exports = API
