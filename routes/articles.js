const express = require('express');
const router = express.Router();


router.get('/news', function(req, res){
    req.flash('success', 'Nyheter');

    res.render('index', {//pass variables
            title:'Events',
            events: ['sf','sdgf','dsfg'],
            user: req.user
        });
});



router.get('/browse', function(req, res){
    req.flash('warning', 'sök ngt');

    res.render('index', {//pass variables
            title:'Events',
            events: ['sf','sdgf','dsfg'],
            user: req.user
        });
});


module.exports = router;
