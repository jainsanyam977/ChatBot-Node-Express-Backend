const sql = require('mssql');
const config = require('./dbconfig');
async function validateID(ID){
    await sql.connect(config);
    const request = await new sql.Request();
    const data = await request.query(`select distinct roomID from roomInfo where roomId = '${ID}'`);
    if(data.recordset.length !== 0){
    return 1;
    }
    return 0;
 }

async function bookRoomWithID(ID, stg, etg, givenDate){
    await sql.connect(config);
    const request = await new sql.Request();
    const data = await request.query(`select distinct(roomId) from receiptInformation where (roomId = '${ID}' and meetingdate = '${givenDate}') and (('${stg}' >= startTime and '${stg}' < endtime) OR ('${etg}'> startTime and '${etg}' <= endTime))`);
    if(data.recordset.length !== 0 ){
        return [false, -1];
    }
    const returnedId = await bookRoomFinal(ID,stg,etg,givenDate);
    return [true, returnedId];
}

async function getRooms(stg, etg, givenDate,givenCap = 0){
    await sql.connect(config);
    const request = await new sql.Request();
    //console.log(`SELECT * FROM roominfo WHERE roomId NOT IN (select distinct(roomId) from receiptInformation where  meetingdate = ${givenDate} and ((${stg} >= startTime and ${stg} < endtime) OR (${etg}> startTime and ${etg} <= endTime))))`);
    return await request.query(`SELECT * FROM roominfo WHERE Cap >= '${givenCap}' AND roomId NOT IN (select distinct(roomId) from receiptInformation where  meetingdate = '${givenDate}' and (('${stg}' >= startTime and '${stg}' < endtime) OR ('${etg}'> startTime and '${etg}' <= endTime)))`);

}

async function bookRoomFinal(ID,startTime, endTime, givenDate,eid = 2022){
    await sql.connect(config);
    const request = await new sql.Request();
    await request.query(`INSERT INTO receiptInformation (roomId,startTime,endTime,meetingDate,empid) VALUES('${ID}','${startTime}','${endTime}','${givenDate}','${eid}')`);
    return await (await request.query('SELECT TOP 1 * from receiptinformation order by receiptId desc')).recordset[0];
}

async function repoMeetInfo(id){
    await sql.connect(config);
    const request = await new sql.Request();
    return await request.query(`SELECT * FROM receiptinformation WHERE receiptId = '${id}'`);
}

async function deleteMeetRepo(id){
    await sql.connect(config);
    const request = await new sql.Request();
    await request.query(`DELETE FROM receiptinformation WHERE receiptId = '${id}'`);
}


async function getEmail(empID){
    await sql.connect(config);
    const request = await new sql.Request();
    return await request.query(`SELECT email FROM employee WHERE EID = ${empID}`);
}

async function checkCapacity(id,capacity){
    await sql.connect(config);
    
    const request = await new sql.Request();
    const data =  await request.query(`SELECT * from roomInfo Where roomID = '${id}' AND cap >= '${capacity}'`);
    console.log(data);
    if(data.recordset.length === 0){
        return 0;
    }
    return 1;
}

module.exports={validateID,getRooms,bookRoomFinal,bookRoomWithID, repoMeetInfo, deleteMeetRepo, getEmail,checkCapacity};
