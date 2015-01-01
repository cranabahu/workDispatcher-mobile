/**
 * Created by cranabahu on 12/31/14.
 */
Meteor.publish('Tasks',function(){
    return TaskDispatchList.find();
});

Meteor.publish('Pics',function(){
    return PictureList.find();
});

Meteor.methods({
   'accept':function(id){
       TaskDispatchList.update({_id: id},{$set:{status:'Accepted'}});

       var task = TaskDispatchList.findOne({_id: id});
       var URL = 'http://localhost:3000/api/accept/'+task.taskId;

       var result = HTTP.call("PUT", URL);

       if(result.statusCode==200) {
           var respJson = result.data;
           console.log("response received.");
           console.log(respJson);
           return respJson;
       } else {
           console.log("Response issue: ", result.statusCode);
           var errorJson = result.data;
           throw new Meteor.Error(result.statusCode, errorJson.error);
       }
   },

    'complete':function(taskIdVar){
        console.log(taskIdVar);
        TaskDispatchList.update({taskId: taskIdVar},{$set:{status:'Completed'}});

        var URL = 'http://localhost:3000/api/complete/'+taskIdVar;

        var result = HTTP.call("PUT", URL);

        if(result.statusCode==200) {
            var respJson = result.data;
            console.log("response received.");
            console.log(respJson);
            return respJson;
        } else {
            console.log("Response issue: ", result.statusCode);
            var errorJson = result.data;
            throw new Meteor.Error(result.statusCode, errorJson.error);
        }
    },

   'update':function(id,startTimeVar,estimatedEndTimeVar,commentVar){

        var updatedData = {
            startTime:startTimeVar,
            completionTime:estimatedEndTimeVar,
            comment:commentVar
        };

        TaskDispatchList.update({_id: id},{$set:updatedData});

        var updatedObject = {data:updatedData};

        var task = TaskDispatchList.findOne({_id: id});
        var URL = 'http://localhost:3000/api/update/task/'+task.taskId;

        var result = HTTP.call("PUT", URL,updatedObject);

        if(result.statusCode==200) {
            var respJson = result.data;
            console.log("response received.");
            console.log(respJson);
            return respJson;
        } else {
            console.log("Response issue: ", result.statusCode);
            var errorJson = result.data;
            throw new Meteor.Error(result.statusCode, errorJson.error);
        }
    },
    
    'sendPic': function (picVar,taskIdVar) {

        var picId_ = 0;
        if (PictureList.find().count() !==  0) {
            var maxCursor = PictureList.findOne({}, {sort: {picId: -1}});
            picId_ = maxCursor.picId + 1;
        }

        var picData = {
            picId: picId_,
            taskId: taskIdVar,
            picture : picVar
        };

        PictureList.insert(picData);

        //TaskDispatchList.update({taskId: taskIdVar},{$set:updatedData});

        var updatedObject = {data:picData};

        var URL = 'http://localhost:3000/api/insert/pic';

        var result = HTTP.call("PUT", URL,updatedObject);

        if(result.statusCode==200) {
            var respJson = result.data;
            console.log("response received.");
            console.log(respJson);
            return respJson;
        } else {
            console.log("Response issue: ", result.statusCode);
            var errorJson = result.data;
            throw new Meteor.Error(result.statusCode, errorJson.error);
        }
    }
});