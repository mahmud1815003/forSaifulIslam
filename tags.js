const mongoose = require('mongoose');


const TagsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        author: {
            type: String,
        },
        avatar: {
            type: String,
        },
        date: {
            type: String,
        },
        duration: {
            type: String,
        },
        views: {
            type: String,
        },
        link: {
            type: String,
        },
        thumbnail: {
            type: String,
        },
        tags: {
            type: String,
        },
        likes: {
            type: Number,
        },
        unlikes: {
            type: Number,
        }
    },
    { timestamps: true }
);

TagsSchema.index({tags: "text"});

module.exports = {
    TagsSchema,
}