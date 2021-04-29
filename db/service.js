 const {validateID,bookRoomWithID,bookRoomFinal,getRooms, repoMeetInfo, deleteMeetRepo, getEmail,checkCapacity} = require('./repository');

 const {calenderBooker} = require(`../calender-api/index`);
const roomMap = {
    "alpha" : 1,
    "beta" : 2,
    "gamma" : 3,
    "delta" : 4,
    "omega" : 5,
    "theta" : 6,
    "lambda" : 7,
    "sigma" : 8,
    "cosine" : 9,
    "cosec" : 10
};
// async function test(){
// console.log(await getRooms("12:00","14:00","2021-03-01",6));
// }
// test();
async function getAllRooms(object1){
    //input = date + start-time + end-time
    //output = roomId
    const date = (object1.queryResult.outputContexts[1].parameters.date).slice(0,10); //if needed convert it to date format
    const startTime = ((object1.queryResult.outputContexts[1].parameters.timePeriod.startTime).slice(11,16));
    const endTime = ((object1.queryResult.outputContexts[1].parameters.timePeriod.endTime).slice(11,16));
    const givenCap = (object1.queryResult.outputContexts[1].parameters.capacity);
    console.log(date,startTime,endTime,givenCap);
    const data = await getRooms(startTime,endTime,date,givenCap);

    // for(item in data.recordset){
    //     if(item.cap >= givenCap)

    // }
    console.log(data.recordset);
    return data.recordset;
    //return data to Sanyam's function
}
async function getRoomById(object2){
    const name = object2.queryResult.outputContexts[1].parameters.roomName;
    const id = roomMap[name];
    const capacity = object2.queryResult.outputContexts[1].parameters.capacity;
    console.log(name,capacity);
    if(await validateID(id)){
        if(await checkCapacity(id,capacity)){
        
        const startTime = ((object2.queryResult.outputContexts[1].parameters.timePeriod.startTime).slice(11,16));
        const endTime = ((object2.queryResult.outputContexts[1].parameters.timePeriod.endTime).slice(11,16));
        const date = (object2.queryResult.outputContexts[1].parameters.date).slice(0,10);
        console.log(date);

        const empID = object2.queryResult.parameters.email;
        //const emailObj = await getEmail(empID);
        //console.log(emailObj);
        const returnedObj = await bookRoomWithID(id,startTime,endTime,date);    
        if(returnedObj[0]){
            //if(emailObj.recordset.length > 0){
                //fetch and pass email
                calenderBooker(date, startTime, endTime, name, empID);
            //}
            return returnedObj;
        }
    }
    }
    return [false,0];
}


async function bookRoom(object3){
    const name = object3.queryResult.parameters.roomName;
    const id = roomMap[name];
    const date = (object3.queryResult.outputContexts[1].parameters.date).slice(0,10);
    const startTime = (object3.queryResult.outputContexts[1].parameters.timePeriod.startTime).slice(11,16);
    const endTime = (object3.queryResult.outputContexts[1].parameters.timePeriod.endTime).slice(11,16);

    if(await validateID(id)){
        const empID = object3.queryResult.outputContexts[1].parameters.email;
        //const emailObj = await getEmail(empID);
        //console.log(emailObj);
        const returnedObj = await bookRoomWithID(id,startTime,endTime,date);
        if(returnedObj[0]){
                calenderBooker(date, startTime, endTime, name, empID);
            return returnedObj;
        }
    }
    return [false, 0];
}

async function meetingInfo(obj){
    const id = obj.queryResult.parameters.meetingId;
    return await repoMeetInfo(id);
}

async function deleteMeetService(obj){
    const id = obj.queryResult.outputContexts[0].parameters.meetingId;
    console.log(id);
    await deleteMeetRepo(id);
}

async function demo(){
    const demoEmail = await getEmail(3001);
    return demoEmail;
}

//console.log(demo());

module.exports = {bookRoom, getRoomById, getAllRooms, meetingInfo, deleteMeetService};