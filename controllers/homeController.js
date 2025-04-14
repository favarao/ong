class homeController{

    screenHome(req, res){
        res.render('home', {layout: 'home'});
    }

};

module.exports = homeController;