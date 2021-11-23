const mongoose = require('mongoose');
const storySeeds = require('./storySeeds')
const Story = require('../models/story')

mongoose.connect('mongodb://localhost:27017/write-pad')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database connected!")
});

const seedDB = async()=>{
    await Story.deleteMany({});
    for(let i = 0; i< 10; i++){
        const random3 = Math.floor(Math.random() * 3)
        const story = new Story({
            title: `${storySeeds[random3].title}`,
            storyText: `${storySeeds[random3].storyText}`
        })
        await story.save()
    }
}

seedDB().then(()=>{
    db.close();
});