const express = require('express')
const router = express.Router();
const {isLoggedIn} = require('../middleware')
const {isAuthor} = require('../middleware')
const writings = require('../controllers/writings')


router.route('/')
    .get(writings.index)
    .post(isLoggedIn, writings.createWriting)

router.get('/new', isLoggedIn, writings.renderNewForm)

router.route('/:id')
    .get(writings.showWriting)
    .put(isLoggedIn, isAuthor, writings.updateWriting)
    .delete(isLoggedIn, isAuthor, writings.deleteWriting)



router.get('/:id/edit', isLoggedIn, isAuthor, writings.renderEditForm)


module.exports = router;