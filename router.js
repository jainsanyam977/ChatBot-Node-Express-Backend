
const { response } = require('express');
const {getAllRooms, bookRoom, getRoomById, meetingInfo, deleteMeetService} = require('./db/service');

async function callGetRooms(object){
    //return {"fulfillmentText" : "Get room called from API"};
    const response = await getAllRooms(object);
    if(response.length === 0) return {"fulfillmentText" : "Sorry, No rooms are available."};
    else{
        let outStr = `Choose the room number from the following:`;
        for(const room of response){
            outStr += ` ${room.roomname},`;
        }

        return {"fulfillmentText" : outStr};
    }
}

async function callBookRoom(object){
    const response = await bookRoom(object);
    if(response[0]){
        const meetingDetails = response[1];
        return {"fulfillmentText" : "The room is booked! Thank you. " + `Meeting Id:${meetingDetails.ReceiptId}, Start Time:${String(meetingDetails.startTime).slice(15, 21)}, End Time:${String(meetingDetails.endTime).slice(15, 21)}, Date:${String(meetingDetails.meetingDate).slice(4, 15)}, RoomId:${meetingDetails.roomId} !`};
    } else {
        return {"fulfillmentText" : "You made an invalid choice, please start again !"};
    }
    
}

async function callCheckAvailability(object){
    //return {"fulfillmentText" : "checkAvailability called from API"};
    const response = await getRoomById(object);
    console.log(response);
    if(response[0] === true){
        const meetingDetails = response[1];
        return {"fulfillmentText" : "The room is booked! Thank you. " + `Meeting Id:${meetingDetails.ReceiptId}, Start Time:${String(meetingDetails.startTime).slice(15, 21)}, End Time:${String(meetingDetails.endTime).slice(15, 21)}, Date:${String(meetingDetails.meetingDate).slice(4, 15)}, RoomId:${meetingDetails.roomId} !`};
    }
    else{   
        const response = await getAllRooms(object);
        console.log("testing");
        let outStr = "";
        for(const room of response){
            outStr += ` ${room.roomname},`;
        }
        return {"fulfillmentText" : outStr};
    }
}


async function getMeetingInfo(object){
    const response = await meetingInfo(object);

    console.log(response);

    if(response.recordset.length !== 0){
        const meetingDetails = response.recordset[0];
        return {"fulfillmentText" : `Meeting Id:${meetingDetails.ReceiptId}, Start Time:${String(meetingDetails.startTime).slice(15, 21)}, End Time:${String(meetingDetails.endTime).slice(15, 21)}, Date:${String(meetingDetails.meetingDate).slice(4, 15)}, RoomId:${meetingDetails.roomId} !`};
    } else{
        return {"fulfillmentText" : "Wrong Meeting ID!"};
    }
}

async function deleteCheck(object){
    const response = await meetingInfo(object);

    if(response.recordset.length !== 0){
        const meetingDetails = response.recordset[0];
        return {"fulfillmentText" : `Meeting Id:${meetingDetails.ReceiptId}, Start Time:${String(meetingDetails.startTime).slice(15, 21)}, End Time:${String(meetingDetails.endTime).slice(15, 21)}, Date:${String(meetingDetails.meetingDate).slice(4, 15)}, RoomId:${meetingDetails.roomId}. Are you sure you want to cancel the booking?`};
    } else{
        return {"fulfillmentText" : "Wrong Meeting ID!"};
    }
}

async function deleteMeet(object){

    await deleteMeetService(object);
    return {"fulfillmentText" : "Meeting cancelled !"};
}


function toRouter(object){
    if(object.queryResult.action === "getRooms"){
        return callGetRooms(object);
    } 
    else if(object.queryResult.action === "bookRoom"){
        return callBookRoom(object);
    }
    else if(object.queryResult.action === "isRoomAvailable"){
        return callCheckAvailability(object);
    } else if(object.queryResult.action === "getMeetInfo"){
        return getMeetingInfo(object);
    } else if(object.queryResult.action === "deleteCheck"){
        return deleteCheck(object);
    }
    else if(object.queryResult.action === "deleteMeet"){
        return deleteMeet(object);
    }
}

module.exports = {toRouter};