const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const restaurants = require('./restaurants.json')

app.engine('handlebars', exphbs ({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res)=> {
  res.render('index', {restaurants: restaurants.results})
})

app.get('/restaurants/:restaurants_id', (req, res) => {
  console.log(req.params.restaurants_id)
  const selectedRestaurant = restaurants.results.find((restaurant)=>{
    return restaurant.id.toString() === req.params.restaurants_id
  })
  res.render('show', { restaurant: selectedRestaurant })
})

app.get('/search', (req, res)=> {
  const keyword = req.query.keyword
  const searchRestaurants = restaurants.results.filter((restaurant)=> {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: searchRestaurants, keyword: keyword } )
})

app.listen(port, ()=> {
  console.log(`Express is listening on localhost: ${port}`)
})

