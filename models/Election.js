const mongoose = require('mongoose');

const electionSchema = mongoose.Schema({
    title: String,
    description: String,
    creator: String,
    phase: String,
    tags: [String],
    candidates: [String],
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

let Election = mongoose.model('Election', electionSchema);

module.exports = Election;

