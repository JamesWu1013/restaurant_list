const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
//const restaurants = require('./restaurants.json')
const Restaurant = require('./models/restaurant')

const mongoose = require('mongoose') // 載入 mongoose
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

app.use(express.static('public'))

app.get('/', (req, res) => {
  Restaurant.find()
          .lean()
          .then(restaurant => res.render('index', {restaurant}))
          .catch(error => console.log(error))

})

app.get('/restaurants/:restaurants_id', (req, res) => {
  console.log(req.params.restaurants_id)
  const selectedRestaurant = restaurants.results.find((restaurant) => {
    return restaurant.id.toString() === req.params.restaurants_id
  })
  res.render('show', { restaurant: selectedRestaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const searchRestaurants = restaurants.results.filter((restaurant) => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: searchRestaurants, keyword: keyword })
})

app.listen(port, () => {
  console.log(`Express is listening on localhost: ${port}`)
})

