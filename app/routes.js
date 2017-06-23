// require dependincies 
var express = require('express');
var router = express.Router();
const User = require('./models/User');
var passport=require('passport');

router.get('/',function(req,res)
{
	res.render('login');
});
router.get('/addPost',ensureAuthenticated,function(req,res)
{
	res.render('addpost');
});
router.get('/showmeMyPosts',ensureAuthenticated,function(req,res)
{
	res.render('showmyposts',{
		posts: req.user.posts
	})
});
router.get('/remove/:index',ensureAuthenticated,function(req,res)
{
	var index = req.params.index;
	if(req.user.posts.length > 0)
	{
		req.user.posts.splice(index,1);
		req.user.save();
		req.flash('success_msg', 'Your Post has been deleted successfully');
		res.redirect('/showmeMyPosts');
	}

});
router.get('/auth/facebook',
  passport.authenticate('facebook',{scope: ['email']}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/showmeMyPosts');
  });
router.get('/logout',ensureAuthenticated, function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/');
});
router.post('/addPost',ensureAuthenticated,function(req,res)
{
	var post=req.body.post;
	req.checkBody('post', 'The Post should not be empty to add it to your Post groups').notEmpty();
	var error= req.validationErrors();
	if(error)
	{
		res.render('addpost',{
			errors:error
		});
	}
	User.findById(req.user._id,function(err,user)
	{
		if(err)
		{
			res.render('addpost',{
				errors:err
		});
		}else{
		user.posts.push(post);
		user.save();
		req.flash('success_msg', 'Your Post has been added successfully');
		res.redirect('/showmeMyPosts');
		}
	});

});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not Authorized');
		res.redirect('/');
	}
}

// export router
module.exports = router;