const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const price = Math.floor(Math.random() * 20) + 10;

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author : '605cbc81d8cdfa1a40c1629c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            discription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus et, dolore asperiores esse quam delectus nesciunt aspernatur debitis officiis nostrum eveniet, eum nihil! Reiciendis vel nam accusantium iure saepe?",
            price: price,
            geometry: {
               type: 'Point',
               coordinates:[
               cities[random1000].longitude, 
               cities[random1000].latitude
               ]
              },
            images :  [
                {
                  url: 'https://res.cloudinary.com/dy0ovjltd/image/upload/v1616933734/YelpCamp/piiksf7vizztwbh8eyp1.jpg',
                  filename: 'YelpCamp/piiksf7vizztwbh8eyp1'
                },
                {
                  url: 'https://res.cloudinary.com/dy0ovjltd/image/upload/v1616933735/YelpCamp/xcpo0beq8cddmkrde9g2.jpg',
                  filename: 'YelpCamp/xcpo0beq8cddmkrde9g2'
                },
                {
                  url: 'https://res.cloudinary.com/dy0ovjltd/image/upload/v1616933735/YelpCamp/zq9mj9wwzqfs482iih1p.jpg',
                  filename: 'YelpCamp/zq9mj9wwzqfs482iih1p'
                },
                {
                  url: 'https://res.cloudinary.com/dy0ovjltd/image/upload/v1616933735/YelpCamp/o5akjo8dnnmgzg4e6xyp.jpg',
                  filename: 'YelpCamp/o5akjo8dnnmgzg4e6xyp'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})