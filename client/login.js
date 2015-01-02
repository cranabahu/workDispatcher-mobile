// counter starts at 0
Meteor.subscribe('Notifications');
Meteor.subscribe('Tasks');
Meteor.subscribe('Pics');

Session.setDefault("userName","");
Session.setDefault("empNo",0);
Session.setDefault("empLat","");
Session.setDefault("empLon","");
Session.setDefault("currentPage","");
Session.setDefault("selectedTask","");
Session.setDefault("contactTaskId","");
Session.setDefault("contactFrom","");
Session.setDefault("photo",null);


window.plugin.notification.local.onclick = function (id, state, json) {
  var respJson = JSON.parse(json);
  Meteor.call('removeNotify',respJson["_id"]);
  window.plugin.notification.local.cancel(id);
  //console.log ("id: " + id + " || state: " + state + "|| json: " + json);
};

//#############Login######################################

Template.login.events({
  'submit .frmLogin':function(event){
    event.preventDefault();
    var userName = event.target.userName.value;
    var password = event.target.userPassword.value;
    if (userName === ""){
      navigator.notification.alert("Please enter user name");
      return;
    }
    if (password === ""){
      navigator.notification.alert("Please enter password");
      return;
    }

    Meteor.call('login',userName,function(error,result){
      if (!error){
        if (result !== null){
          Session.set("userName",result["name"]);
          Session.set("empNo",result["empNo"]);
          Session.set("empLat",result["lat"]);
          Session.set("empLon",result["lng"]);
          Session.set("currentPage","/overview");
          Router.go("/overview");
        }
        else{
          navigator.notification.alert("Login failed");
        }
      }
      else{
        navigator.notification.alert("Server Not responding");
      }
    });
  }
});

//############# Overview ######################################

Template.overview.helpers({
  'userName':function(){
    return Session.get("userName");
  },

  'requests':function(){
    var empNoVar = Session.get("empNo");
    if (NotificationList.find({empNo:empNoVar}).count() > 0){
      var task = NotificationList.findOne({empNo:empNoVar});
      window.plugin.notification.local.add(
          {
            id: 1,
            title: 'You got a New Job',
            message: 'Task '+ task.taskId +' dispatch to you!',
            json: task,
            led: 'A0FF05'
          });
    }
    return TaskDispatchList.find({name:Session.get("userName"), status:"Dispatched"}).count();
  },

  'jobs':function(){
    return TaskDispatchList.find({name:Session.get("userName"), status:"Accepted"}).count();
  }
});

Template.overview.events({
  'click .newTask': function () {
    Session.set("currentPage","/userNewTask");
    Router.go('/userNewTask');
  },

  'click .acceptedTask': function () {
    Session.set("currentPage","/userAcceptedTask");
    Router.go('/userAcceptedTask');
  }
});



