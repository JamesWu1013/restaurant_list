const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
//const restaurants = require('./restaurants.json')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')

const mongoose = require('mongoose') // 載入 mongoose
const restaurant = require('./models/restaurant')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.log(error))

})

app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  const id = req.body.id
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return Restaurant.create({
    id,
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description
  })     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})


app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))

})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))

})
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const fakeId = req.body.id
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return Restaurant.findById(id)
    .then((restaurant) => {
      console.log(restaurant, 11111)
      restaurant.id = fakeId,
        restaurant.name = name,
        restaurant.name_en = name_en,
        restaurant.category = category,
        restaurant.image = image,
        restaurant.location = location,
        restaurant.phone = phone,
        restaurant.google_map = google_map,
        restaurant.rating = rating,
        restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})

app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get("/search", (req, res) => {
  if (!req.query.keyword) {
    return res.redirect("/");
  }

  const keywords = req.query.keyword.toLowerCase().trim();
  Restaurant.find()
    .lean()
    .then((Restaurant) => {
      const filterRestaurants = Restaurant.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(keywords) ||
          restaurant.category.toLowerCase().includes(keywords)
      );
      res.render("index", {
        restaurant: filterRestaurants,
        keywords
      });
    })
    .catch((error) => console.log(error));
});


app.listen(port, () => {
  console.log(`Express is listening on localhost: ${port}`)
})

