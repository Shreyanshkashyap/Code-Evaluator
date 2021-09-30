const express = require('express')

const app = express()

app.use('/', express.static(__dirname + '/public'))

app.use(express.urlencoded({extended: true}))

function decryptQueryParams(req, res ,next) {
    console.log('decrypt',typeof req.query.encrypted,req.query.encrypted,req.query)
    if(req.query.encrypted === 'true') {
        console.log('decrypting....')
        let s = "" 
        Array.from(req.query.code).forEach((char) => {
            s += (char === char.toLowerCase())?(char.toUpperCase()):(char.toLowerCase())
        })
        req.query.code = s    
    }
    console.log('decrypted',req.query)
    next()
}

function decodeQueryBase64(req, res, next) {
    console.log('decode',req.query)
    for (let q in req.query) {
        let data = req.query[q] 
        data = new Buffer(data, 'base64').toString('ascii')
        req.query[q] = data
    }
    console.log('decoded',req.query)
    next()
}

app.get('/eval', decryptQueryParams, decodeQueryBase64, (req, res) => {
    console.log(req.query)
    let response =  `{"output" : "${eval(req.query.code)}"}`
    let result = JSON.parse(response)
    res.json(result)
})

app.listen(4545, () => {
    console.log('server started on http://localhost:4545')
})