var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    venu: String,
    date: String,
    time: String,
    cost: Number,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    regs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model("Event", eventSchema);