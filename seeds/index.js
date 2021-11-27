const mongoose = require("mongoose");
const writingSeeds = require("./writingSeeds");
const Writing = require("../models/writing");

mongoose.connect("mongodb://localhost:27017/write-pad");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});

const seedDB = async () => {
    await Writing.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random3 = Math.floor(Math.random() * 3);
        const writing = new Writing({
            author: "619ebd6a073503c92602fb4e",
            title: `${writingSeeds[random3].title}`,
            writingText: `${writingSeeds[random3].writingText}`,
        });
        await writing.save();
    }
};

seedDB().then(() => {
    db.close();
});
