//http://localhost:9090/

const express = require('express');

const app = express();
const PORT = 9090;
app.use(express.json());



const rooms = [
    {
        "roomid": "R1",
        "seats": 20,
        "priceperhour": 500,
        "amenities": ["ac", "lift", "fan"],
    },
    {
        "roomid": "R2",
        "seats": 25,
        "priceperhour": 800,
        "amenities": ["ac", "lift"],
    },
    {
        "roomid": "R3",
        "seats": 15,
        "priceperhour": 300,
        "amenities": ["ac", "fan"],
    }
]

const bookings = [
  {
    "bookid": "1",
    "cxName": "Ram",
    "roomid": "R1",
    "status": "Booked",
    "date": "20230916",
    "starttime": "10:00 am",
    "endtime": "06:00 pm",
  },
  {
    "bookid": "2",
    "cxName": "Priya",
    "roomid": "R2",
    "status": "Booked",
    "date": "20230915",
    "starttime": "10:00 am",
    "endtime": "06:00 pm",
  },
  {
    "bookid": "3",
    "cxName": "Ragul",
    "roomid": "R3",
    "status": "Booked",
    "date": "20230917",
    "starttime": "10:00 am",
    "endtime": "06:00 pm",
  }
] 



//Room Info
app.get("/room/all", (req, res)=>{
    res.json({Rooms: rooms});
})

//Room Add
app.post("/room/add", (req, res)=>{
    const {
        id, seats, 
        priceperhour, amenities
    } = req.body;

    const newRoom = {
        id, seats, 
        priceperhour, amenities
    };

    rooms.push(newRoom);
    res.json(newRoom);

} )


//Room Booking
app.post("/booking/new", (req, res)=>{
    const { bookid, roomid, cxName, date, starttime, endtime } = req.body;
    
    const booking = bookings.find((booking)=> booking.roomid === roomid);
    if(booking){
        if(booking.date === date && booking.starttime === starttime ){
            res.status(400).json(({Error: "Already Booked"}));
        }else{
          booking.bookid = bookid;
          booking.status = "Booked";
          booking.cxName = cxName;
          booking.date = date;
          booking.starttime = starttime;
          booking.endtime = endtime;
            
            res.status(200).json({Message: "Hall Booked" });
        }
    }else{
        res.status(404).json({Error: "Not Found"});
    }
})

//Booking Details
app.get("/booking/details", (req, res) => {
    let data = [];
    bookings.map((e) => {
      if (e.status == "Booked") {
        data.push({
          bookid: e.id,
          roomid: e.roomid,
          status: e.status,
          cxName: e.cxName,
          date: e.date,
          starttime: e.starttime,
          endtime: e.endtime,
        });
      }
    });
    res.json({Bookings: data});
  });


  //CX Details
  app.get("/customer-details", (req, res) => {
    let data=[];
    bookings.filter((book) => book.status === "Booked").map((booking) => data.push({
      bookid: booking.bookid,
      cxName: booking.cxName,
      date: booking.date,
      starttime: booking.starttime,
      endtime: booking.endtime,
    }));
    res.json(data);
  });


//No of times Cx booked the room
app.get("/booking/count-cx", (req, res) => {
    data=[];
    const { cxName } = req.query;
    bookings.filter(
      (booking) =>
      booking.cxName === cxName
    ).map((booking) =>data.push({
      roomid: booking.roomid,
      cxName: booking.cxName,
      date: booking.date,
      startTime: booking.starttime,
      endTime: booking.endtime,
    }));
    const bookingCount = data.length;
    res.json({ data, bookingCount });
  });



//Port Listen
app.listen(PORT, ()=>console.log("Service started in Localhost Port:", PORT));