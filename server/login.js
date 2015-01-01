
Meteor.publish('Notifications',function(){
        return NotificationList.find();
    }
);


Meteor.methods({
    'removeNotify':function(id){
        NotificationList.remove({_id:id});
    },

    'login':function(userName){
        var URL = 'http://localhost:3000/api/findEmp/'+userName;

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
    }
});