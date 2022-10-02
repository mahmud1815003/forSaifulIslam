const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { productSchema } = require('./product');
const axios = require('axios');
dotenv.config();


mongoose.connect(process.env.data_base_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Database Connection Successful')
}).catch((err) => {
    console.log('Connection Error ' + err);
});

const Product = new mongoose.model('Products', productSchema);



app.get('/', (req, res) => {
    res.send("Hello World");
})

//Adding Data to my MongoDb Database, Do not hit this Port if You want to use your own database, just change the 
//database url link in .evn file;
app.get('/addData', async (req, res) => {
    try {
        const products = await axios.get('https://redux-filter.imsaifun.com/api/products');
        const productData = products.data;
        for (let pro of productData) {
            const produtModel = new Product({
                title: pro.title,
                description: pro.description,
                author: pro.author,
                avatar: pro.avatar,
                date: pro.date,
                duration: pro.duration,
                views: pro.views,
                link: pro.link,
                thumbnail: pro.thumbnail,
                tags: pro.tags.join(" "),
                likes: pro.likes,
                unlikes: pro.unlikes,
            });
            await produtModel.save();
        }
        res.send('Data Added');
    } catch(err) {
        console.log('Adding Error ' +err);
    }

});

//hit this port like "http://localhost:5000/tags/tailwindccs javascript" then you receive the 
//json response
app.get('/tags/:iDs', async (req,res) => {
    const {iDs} = req.params;
    const products = await Product.find({$text: {$search: `${iDs}`}}, { score: { $meta: "textScore" } });
    res.send(products);
})

app.listen(process.env.port, () => {
    console.log(`Server Listening on Port ${process.env.port}`);
});