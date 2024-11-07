import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "http://api.openweathermap.org";


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

const API_KEY="";

app.use(express.static("public"));

let data;
let j=0;
let day=1;
let daysMax=[];
let daysMin=[];
let week=[];
let id=1;
let max=0;
let min=0;

const today = new Date();
const tomorrow = new Date(today);
 

app.get("/", (req, res)=>{
res.render("partials/enter.ejs");
});

app.post("/", async (req, res)=>{
  try {
    week=[];// clear array
    id=1; // update id 
    const response= await axios.get(API_URL+`/geo/1.0/direct?q=${req.body.city}&limit=5&appid=${API_KEY}`);
    const result= response.data;
    
    console.log(req.body);
     
    console.log(JSON.stringify(result[0].name));
    
    const response_1= await axios.get(API_URL+`/data/2.5/weather?lat=${result[0].lat}&lon=${result[0].lon}&appid=${API_KEY}`);
    const result_1= response_1.data;

    console.log(result_1.weather[0].main);

    const response_5d= await axios.get(API_URL+`/data/2.5/forecast?lat=${result[0].lat}&lon=${result[0].lon}&appid=${API_KEY}`);
    const result_5d= response_5d.data;

    
    for(let i=0; i<40; i++){
    
    
      let tempMax=Math.floor(result_5d.list[i].main.temp_max -273.15) ;
      let tempMin=Math.floor(result_5d.list[i].main.temp_min -273.15) ;
      daysMax.push(tempMax);
      daysMin.push(tempMin);
      tempMax=0;
      tempMin=0;
      j++; // j*3 - j*3 - time zone in which one predicted the weather

      if(j*3>=24){
/* dates */
        tomorrow.setDate(tomorrow.getDate() + 1);
        let dayNow = today.getUTCDate()+id; 
        let month = today.getUTCMonth() + 1; 
/* max min tC per day*/
        max=Math.max(...daysMax);
        min=Math.min(...daysMin)
        console.log(max+"°C");
        console.log(min+"°C");
        week.push({id,max, min, dayNow, month});
        daysMax=[];
        daysMin=[];
        max=0;
        min=0;
        day++;
        j=0;
        id++;
      }
    }
    
    console.log(week)
    res.render("main.ejs", {content: (result),
      weather: (result_1),
      forecast: (week),
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(404).send(error.message);
  }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });