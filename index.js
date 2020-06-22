const firebase = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

var serviceAccount = require("./firebase.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://database-file-administrasi.firebaseio.com"
});

var app = express()

app.set('view engine', 'ejs')

app.use('/public', express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser('fauzi'))

app.get('/', function(req, res, next){
    return res.redirect('/masuk')
})

app.get('/daftar', function(req, res, next){
    return res.render('signup')
})

app.get('/masuk', function(req, res, next){
    var token = req.cookies.auth
    if(token){
        firebase.auth().verifyIdToken(token).then(function(decodedToken) {
            req.user = decodedToken
            res.redirect('/beranda')
        }).catch(function(error) {
            res.render('signin')
        });
    } else {
        return res.render('signin')
    }
})

app.get('/validate-token/:token', function(req, res, next){
    var token = req.params.token
    var userData
    firebase.auth().verifyIdToken(token).then(function(decodedToken) {
        res.cookie('auth', token)
        userData = decodedToken

        return firebase.database().ref('admin').once('value')
    }).then(snapshot => {
        const adminEmails = snapshot.val()
        const isMatch = adminEmails.match(userData.email)

        if(!isMatch) {
            return res.redirect('/beranda')
        }

        return res.redirect('/admin')
    }).catch(function(error) {
        console.error(error)
        res.send("gagal")
    });
})

app.use(function (req, res, next){
    var token = req.cookies.auth
    if(!token){
        return res.redirect('/masuk')
    }

    firebase.auth().verifyIdToken(token).then(function(decodedToken) {
        req.user = decodedToken
        next()
    }).catch(function(error) {
        res.redirect('/masuk')
    });
})

app.get('/beranda', notAdminValidation, function(req, res, next){
    res.render('homepage')
})

app.get('/dokumen', notAdminValidation, function(req, res, next){
    res.render('dokumen')
})

app.get('/pengaturan', notAdminValidation, function(req, res, next){
    res.render('pengaturan')
})

app.get('/pengumuman', notAdminValidation, function(req, res, next){
    res.render('pengumuman')
})

app.get('/keluar', function(req, res, next){
    res.clearCookie('auth')
    res.redirect('/masuk')
})

//validasi admin
app.use(function (req, res, next){
    const email = req.user.email

    firebase.database().ref('admin').once('value', (snapshot) => {
        const adminEmails = snapshot.val()
        const isMatch = adminEmails.match(email)

        if(!isMatch) {
            return res.redirect('/beranda')
        }

        next()
    })
})

app.get('/admin', function(req, res, next){    
    res.render('admin/homepage')
})

app.get('/dokumen_admin', function(req, res, next){    
    res.render('admin/dokumen')
})

app.get('/pengaturan_admin', function(req, res, next){    
    res.render('admin/pengaturan')
})

app.get('/pengumuman_admin', function(req, res, next){    
    res.render('admin/pengumuman')
})

app.listen(5000, function(){
    console.log('app.started')
})

function notAdminValidation(req, res, next) {
    //validasi admin
    const email = req.user.email

    firebase.database().ref('admin').once('value', (snapshot) => {
        const adminEmails = snapshot.val()
        const isMatch = adminEmails.match(email)

        if(isMatch) {
            return res.redirect('/admin')
        }

        next()
    })
}