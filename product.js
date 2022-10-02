const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: String,
    description: String,
    author: String,
    avatar: String,
    date: String,
    duration: String,
    views: String,
    link: String,
    thumbnail: String,
    tags: String,
    likes: Number,
    unlikes: Number,
});

productSchema.index({tags: "text"});

module.exports = {
    productSchema,
}