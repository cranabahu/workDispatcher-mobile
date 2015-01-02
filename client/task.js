/**
 * Created by cranabahu on 12/30/14.
 */

//####################### userNewTask #####################################

Template.userNewTask.helpers({
    task: function () {
        var empNoVar = Session.get("empNo");
        if (empNoVar !== 0){
            return TaskDispatchList.find({empNo: empNoVar, status: 'Dispatched'})
        }else{
            return null;
        }
    },
    selectedClass: function () {
        var selectTask = this._id;
        var selectedTask = Session.get("selectedTask");
        if(selectTask === selectedTask){
            return "selected";
        }
    }
});

Template.userNewTask.events({
    'click .back': function () {
        Session.set("currentPage","/overview");
        Router.go('/overview');
    },

    'click .itemTask':function(){
        var selectTask = this._id;
        Session.set("selectedTask",selectTask);
        Session.set("currentPage","/detailTask");
        Router.go('/detailTask');
    }
});

//######################## detailTask ####################################

Template.detailTask.helpers({
    viewTask:function(){
        return TaskDispatchList.find({_id:Session.get("selectedTask")});
    },
    photo: function () {
        return Session.get("photo");
    }
});

Template.detailTask.events({
    'click .back':function(){
        Session.set("currentPage","/userNewTask");
        Router.go('/userNewTask');
    },

    'click .accept':function(){
        //document.location.href = 'tel:+1-800-555-1234';
        var selectTask = this._id;
        Meteor.call("accept",selectTask);
        Session.set("selectedTask",selectTask);
        Session.set("currentPage","/workingTask");
        Router.go('/workingTask');
    },
    'click .viewRoute':function(){
        Session.set("contactTaskId",this._id);
        Session.set("contactFrom","detailTask");
        Session.set("currentPage","/contact");
        Router.go('/contact');
    }
});

//####################### userAcceptedTask #####################################

Template.userAcceptedTask.helpers({
    task: function () {
        var empNoVar = Session.get("empNo");
        return TaskDispatchList.find({empNo: empNoVar, status: 'Accepted'})
    },

    selectedClass: function () {
        var selectTask = this._id;
        var selectedTask = Session.get("selectedTask");
        if(selectTask === selectedTask){
            return "selected";
        }
    }
});

Template.userAcceptedTask.events({
    'click .back': function () {
        Session.set("currentPage","/overview");
        Router.go('/overview');
    },

    'click .itemTask':function(){
        var selectTask = this._id;
        Session.set("selectedTask",selectTask);
        Session.set("currentPage","/workingTask");
        Router.go('/workingTask');
    }
});

//####################### workingTask #####################################

Template.workingTask.helpers({
    viewTask:function(){
        return TaskDispatchList.find({_id:Session.get("selectedTask")});
    }
});

Template.workingTask.events({
    'click .back':function(){
        Session.set("currentPage","/userAcceptedTask");
        Router.go('/userAcceptedTask');
    },

    'click .updateTask':function(){
        //document.location.href = 'tel:+1-800-555-1234';
        var startTime = document.getElementById('startTime').value;
        var estimatedEndTIme = document.getElementById('estimatedEndTime').value;
        var comment = document.getElementById('comment').value;
        console.log(startTime);
        Meteor.call("update",this._id,startTime,estimatedEndTIme,comment,function(error,result){
            if(!error){
                navigator.notification.alert('Successfully Updated');
            }else{
                navigator.notification.alert('Server Error!!');
            }
        });
    },
    'click .viewRoute':function(){
        Session.set("contactTaskId",this._id);
        Session.set("currentPage","/contact");
        Router.go('/contact');
    },

    'click .viewAttachments':function(){
        Session.set("contactTaskId",this._id);
        Session.set("currentPage","/attachments");
        Router.go('/attachments');
    },

    'click .complete':function(){
        var taskId = this.taskId;
        navigator.notification.confirm(
            'Completing task ?',  // message
             function(buttonIndex){
                 //alert('You selected button ' + buttonIndex);
                 if(buttonIndex===1){
                     Meteor.call('complete',taskId);
                     Session.set("currentPage","/userAcceptedTask");
                     Router.go('/userAcceptedTask');
                 }
             },                  // callback to invoke
            'Confirm',            // title
            ['Yes','No'],             // buttonLabels
            'Confirm'                 // defaultText
        );
    }
});

//################## Contact ###################################################
Template.contact.helpers({
    'viewTask':function(){
       return TaskDispatchList.find({_id:Session.get("contactTaskId")}).fetch();
    }
});

Template.contact.events({
    'click .back':function(){
        if(Session.get("contactFrom") == ""){
            Session.set("currentPage","/workingTask");
            Router.go('/workingTask');
        }else{
            Session.set("currentPage","/detailTask");
            Router.go('/detailTask');
        }
    },

   'click .renderMap':function(){
       console.log('loading map..');
       var startLat = 0;
       var startLon = 0;
       var resentTask = null;
       resentTask = TaskDispatchList.findOne({empNo:Session.get('empNo'),status:'Done'},{$sort:{taskId: 1}});

       if (resentTask == null){
           startLat = Session.get("empLat");
           startLon = Session.get("empLon");
       }else{
           startLat = resentTask.lat;
           startLon = resentTask.lng;
       }
       var task = TaskDispatchList.findOne({_id:Session.get("contactTaskId")});
       gmap.initialize();
       gmap.calcRoute(startLat,startLon,task.lat,task.lng);
   }
});

//############## Attachment ################################################
Template.attachments.helpers({
    'viewTask':function(){
        return TaskDispatchList.find({_id:Session.get("contactTaskId")}).fetch();
    },
    photos: function () {
        return PictureList.find({taskId:this.taskId},{sort: {picId: -1}})
    }
});

Template.attachments.events({
    'click .back':function(){
        Session.set("currentPage","/workingTask");
        Router.go('/workingTask');
    },

    'click .takePic': function () {
        var cameraOptions = {
            width: 400,
            height: 300
        };

        MeteorCamera.getPicture(cameraOptions, function (error, data) {
            if(!error){
                Session.set("photo", data);
            }else{
                Session.set("photo",null);
                console.log(error);
            }
        });
        var pic = Session.get("photo");
        if (pic){
            Meteor.call('sendPic',pic,this.taskId);
        }

    }
});

//###########optionIcon#######################################
Template.optionIcon.events({
    'click .button': function () {
        var currentPage = Session.get("currentPage");
        if (currentPage === "/overview"){
            navigator.notification.confirm(
                'Log out?',  // message
                function(buttonIndex){
                    //alert('You selected button ' + buttonIndex);
                    if(buttonIndex===1){
                        Session.set("empNo",0);
                        Session.set("currentPage","/");
                        Router.go('/');
                    }
                },                    // callback to invoke
                'Options',            // title
                ['Logout','Cancel'],  // buttonLabels
                ''                    // defaultText
            );
        }else{
            navigator.notification.confirm(
                'Select your Option',  // message
                function(buttonIndex){
                    //alert('You selected button ' + buttonIndex);
                    if(buttonIndex===1){
                        Session.set("currentPage","/overview");
                        Router.go('/overview');
                    }

                    if(buttonIndex===2){
                        Session.set("empNo",0);
                        Session.set("currentPage","/");
                        Router.go('/');
                    }
                },                  // callback to invoke
                'Options',            // title
                ['Go Home','Logout','Cancel'],             // buttonLabels
                ''                 // defaultText
            );
        }

    }
});