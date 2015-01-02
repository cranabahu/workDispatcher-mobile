/**
 * Created by cranabahu on 12/25/14.
 */

// receive new task, notify user
// api:      http://localhost:3100/api/update/post/:postId
// example:  http://localhost:3100/api/update/post/314159
Router.route('/api/newTask', function(){
    //console.log('receive Data');
    //console.log(this.request.body);
    //console.log(this.request.body.taskId);
    //console.log(this.request.body.empNo);

    this.response.statusCode = 200;
    this.response.setHeader("Content-Type", "application/json");
    this.response.setHeader("Access-Control-Allow-Origin", "*");
    this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    this.response.end('Result of updating post is ' + JSON.stringify(
        NotificationList.insert({
            taskId: this.request.body.taskId,
            empNo: this.request.body.empNo
        }),
        TaskDispatchList.insert({
            id:this.request.body.id,
            taskId: this.request.body.taskId,
            repairPart: this.request.body.repairPart,
            customer: this.request.body.customer,
            contact: this.request.body.contact,
            empNo: this.request.body.empNo,
            name: this.request.body.name,
            startTime: "",
            dueDate: this.request.body.dueDate,
            estimatedTime: 0,
            completionTime:0,
            location:this.request.body.location,
            lat:this.request.body.lat,
            lng:this.request.body.lng,
            status:this.request.body.status,
            desc: this.request.body.desc,
            severity:this.request.body.severity
        })
    ));
}, {where: 'server'});