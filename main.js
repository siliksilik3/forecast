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
let data1;

app.get("/", (req, res)=>{
res.render("partials/enter.ejs");
});

app.post("/", async (req, res)=>{
  try {
    const response= await axios.get(API_URL+`/geo/1.0/direct?q=${req.body.city}&limit=5&appid=${API_KEY}`);
    const result= response.data;
    
    console.log(req.body);
     
    console.log(JSON.stringify(result[0].name));
    
    const response_1= await axios.get(API_URL+`/data/2.5/weather?lat=${result[0].lat}&lon=${result[0].lon}&appid=${API_KEY}`);
    const result_1= response_1.data;

    console.log(result_1.weather[0].main);

    

    res.render("main.ejs", {content: (result),
      weather: (result_1),

    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(404).send(error.message);
  }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });