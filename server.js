var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');

var petController = require('./controller/pet');
var userController = require('./controller/user');
var authController = require('./controller/auth');

mongoose.connect('mongodb://127.0.0.1:27017/petshot', { useMongoClient: true });
mongoose.Promise = global.Promise;

var app = express();

var port = process.env.PORT || '3090';
var router = express.Router();

// 注：中间件位置很重要
// app.use(bodyParser.raw);

// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// app.use(bodyParser.json);

var Pet = require('./models/pet');

router.get('/', function(req, res) {
    res.json({ "message": "欢迎访问" })
})

// 给路由设定根路径为/api
app.use('/api', router);

var petRouter = router.route('/pets');
var userRouter = router.route('/users');

router.route('/pets')
    .post(authController.isAuthenticated, petController.postPets)
    .get(authController.isAuthenticated, petController.getPets);

router.route('/pets/:pet_id')
    .get(authController.isAuthenticated, petController.getPet)
    .put(authController.isAuthenticated, petController.updatePet)
    .delete(authController.isAuthenticated, petController.deletePet);

router.route('/users')
    .post(userController.postUsers)
    .get(authController.isAuthenticated, userController.getUsers);

app.listen(port, function() {
    console.log('server is running at http://localhost:3090');
});