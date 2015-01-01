/**
 * Created by cranabahu on 12/26/14.
 */
/*Router.map(function () {
    this.route('login', {path: '/'} );
    this.route('hello');
})*/

Router.route('/', function () {
    //this.render('login');
    if (Session.get("empNo") === 0) {
        console.log("login page");
        this.render('login');
    } else {
        console.log("already log");
        var currentPage = Session.get("currentPage");
        if (currentPage !== ""){
            this.render(currentPage);
        }
    }
});

Router.route('/overview', function(){
   this.render('overview');
});

Router.route('/userNewTask', function () {
    this.render('userNewTask');
});

Router.route('/detailTask', function(){
    this.render('detailTask');
});

Router.route('/userAcceptedTask',function(){
    this.render('/userAcceptedTask');
});

Router.route('/workingTask',function(){
    this.render('workingTask');
});

Router.route('/contact',function(){
   this.render('contact');
});

Router.route('/attachments',function(){
    this.render('attachments');
});

Router.route('/temp', function () {
   this.render('temp');
});

/*Router.onBeforeAction(function() {
    if (Session.get("empNo") === 0) {
        console.log("login page");
        this.render('login');
    } else {
        console.log("already log");
        var currentPage = Session.get("currentPage");
        if (currentPage !== ""){
            this.render(currentPage);
        }
        this.next();
    }
});

Router.route('/items/:_id', function () {
    var item = Items.findOne({_id: this.params._id});
    this.render('ShowItem', {data: item});
});*/