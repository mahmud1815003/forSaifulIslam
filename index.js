const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { TagsSchema } = require('./tags');
const {SearchSchema} = require('./search');
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

const Tags = new mongoose.model('lwsTags', TagsSchema);
const Search = new mongoose.model('lwsSearch', SearchSchema);



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
            const tagsData = new Tags({
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
            const searchData = new Search({
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
            await tagsData.save();
            await searchData.save();
        }
        res.send('Data Added');
    } catch(err) {
        console.log('Adding Error ' +err);
    }

});

//hit this port like "http://localhost:5000/tags/tailwindccs javascript" then you receive the 
//json response
app.get('/tags/:iDs', async (req,res) => {
    const {iDs} = req.params || "";
    console.log(iDs);
    let products;
    if(iDs != ""){
        products = await Tags.find({$text: {$search: `${iDs}`}}, { score: { $meta: "textScore" } });
    }else{
        products = Tags.find({});
    }
    res.send(products);
});

async function dataGetter() {
    const iDs = "javascript react"
    console.log(iDs);
    let products;
    if(iDs != ""){
        products = await Tags.find({$text: {$search: `${iDs}`}}, { score: { $meta: "textScore" } });
    }else{
        products = await Tags.find({});
    }
    console.log(products);
}

dataGetter();

app.listen(process.env.port, () => {
    console.log(`Server Listening on Port ${process.env.port}`);
});