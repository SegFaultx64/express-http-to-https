process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { readFileSync } = require('fs')
const https = require('https')
const express = require('express')
const request = require('supertest')
const { redirectToHTTPS } = require('../index')

const app = express()
const app2 = express()
const app3 = express()
const app4 = express()
const app5 = express()

const httpsServer = https.createServer({
  key: readFileSync(`${__dirname}/fixtures/test_key.pem`),
  cert: readFileSync(`${__dirname}/fixtures/test_cert.pem`)
}, app4).listen(8443)

app.use(redirectToHTTPS())
app.get('/user', (req, res) => {
  res.status(200).json({ name: 'tobi' })
})

request(app)
  .get('/user')
  .expect(302)
  .expect((value) => {
    return /https/.test(value.headers.location)
  })
  .end((err) => {
    if (err) {
      throw err
    }

    console.log('Should redirect from http to https')
  })

app2.use(redirectToHTTPS([/127\.0\.0\.1/]))
app2.get('/user', (req, res) => {
  res.status(200).json({ name: 'tobi' })
})

request(app2)
  .get('/user')
  .expect(200, {
    name: 'tobi'
  })
  .end((err) => {
    if (err) {
      throw err
    }

    console.log('Should not redirect specific host from http to https')
  })

app3.use(redirectToHTTPS([], [/\/user/]))
app3.get('/user', (req, res) => {
  res.status(200).json({ name: 'tobi' })
})
app3.get('/home', (req, res) => {
  res.status(200).json({ data: 'other' })
})

request(app3)
  .get('/user')
  .expect(200, {
    name: 'tobi'
  })
  .end((err) => {
    if (err) {
      throw err
    }

    console.log('Should not redirect specific path from http to https')
  })

request(app3)
  .get('/home')
  .expect(302)
  .expect((value) => {
    return /https/.test(value.headers.location)
  })
  .end((err) => {
    if (err) {
      throw err
    }

    console.log('Should redirect other path from http to https')
  })

app4.use(redirectToHTTPS())
app4.get('/user', (req, res) => {
  res.status(200).json({ name: 'tobi' })
})

request(httpsServer)
  .get('/user')
  .expect(200, {
    name: 'tobi'
  })
  .end((err) => {
    if (err) {
      throw err
    }

    console.log('Should not redirect from https to https')
    httpsServer.close()
  })

app5.use(redirectToHTTPS([], [], 301))
app5.get('/user', (req, res) => {
  res.status(200).json({ name: 'tobi' })
})

request(app5)
  .get('/user')
  .expect(301)
  .expect((value) => {
    return /https/.test(value.headers.location)
  })
  .end((err) => {
    if (err) {
      throw err
    }

    console.log('Should be able to set alternative code')
  })
