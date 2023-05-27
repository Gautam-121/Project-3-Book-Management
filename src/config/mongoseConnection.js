const mongoose = require("mongoose")

const connection = async () => {

    try {
        const data = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true
        })

        if(data){
            console.log("mongoDb is connected")
        }
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = connection