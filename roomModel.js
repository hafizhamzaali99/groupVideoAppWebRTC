const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomId: 
        {
            type: String,
            required: true,
        },
    person: [
        {
            type: String,
            required: true,
        }
    ],
    status: {
        type: String,
        enum: ["Active","Inactive"],
        default:"Active"
    }
})

module.exports = mongoose.model('room',roomSchema)