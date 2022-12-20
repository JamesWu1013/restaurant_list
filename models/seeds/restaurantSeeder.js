const mongoose = require('mongoose')
const Restaurant = require('../restaurant') // 載入 todo model
const data = require('../../restaurants.json').results

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < 8; i++) {
    Restaurant.create({
      id: data[i].id,
      name: data[i].name,
      name_en: data[i].name_en,
      category: data[i].category,
      image: data[i].image,
      location: data[i].location,
      phone: data[i].phone,
      google_map: data[i].google_map,
      rating: data[i].rating,
      description: data[i].description
    })
  }
  console.log("done")
})