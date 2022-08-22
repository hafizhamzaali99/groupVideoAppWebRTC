const mongoose = require("mongoose");

const dbConnect = async ()=>{
    mongoose.connect(process.env.URL).then((data)=>{
        console.log(`Database is connected to ${data.connection.host}`)
    }).catch((err)=>{
        console.log("error",err.message)
    })
}

module.exports = dbConnect;