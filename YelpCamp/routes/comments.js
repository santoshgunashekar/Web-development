var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');


//Comments new 
router.get('/new', middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id.trim(), function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

//Comments create
router.post('/', middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id.trim(), function(err, campground) {
        if (err) {
            console.log(err);
            redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash('error', 'Something went wrong!');
                    console.log(err);
                } else {
                    comment.author = { username: req.user.username, id: req.user._id };
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Successfuly added comment!');
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
});


//comment update form
router.get('/:comments_id/edit', middleware.commentOwnership, function(req, res) {
    Comment.findById(req.params.comments_id, function(err, foundComment) {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
        }
    });
});


//comment update
router.put('/:comments_id', middleware.commentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
})

//comment destroy route
router.delete('/:comments_id', middleware.commentOwnership, function(req, res) {
    Comment.findByIdAndDelete(req.params.comments_id, function(err) {
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted successfully!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});
module.exports = router;