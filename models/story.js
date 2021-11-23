const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const StorySchema = new Schema({
    title: String,
    storyText: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})


//Story Deletion Middleware
StorySchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Story', StorySchema);