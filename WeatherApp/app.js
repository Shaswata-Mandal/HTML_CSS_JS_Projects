//Selecting all the varying elements
const userInput=document.querySelector("#city-input");
const button=document.querySelector("#search-button");

const weatherImg=document.querySelector(".weather-icon");
const temperature=document.querySelector(".temperature");
const weatherDescription=document.querySelector(".weather-description");
const cityDisplay=document.querySelector(".city");

const humidity=document.querySelector("#humidity");
const windSpeed=document.querySelector("#wind-speed");

const row4=document.querySelector(".row4");

const apiKey="1c2d3c250570878f5b636fe09bd67bdc";
const baseURL="https://api.openweathermap.org/data/2.5/weather?";

//when loaded get the kolkata weather as default
window.addEventListener("load", ()=>{
    console.log("working")
    let city="Kolkata";
    getWeather(city);
})

//adding event to button
button.addEventListener("click", (event)=>{
    event.preventDefault();
    let city=userInput.value;
    getWeather(city);
})

//Getting response from api and updating it
async function getWeather(city) {

    //selecting the loader
    let loaderBox=document.querySelector(".loader-box");
    //Showing loading and hide content
    loaderBox.style.display = "flex"; 
    document.querySelectorAll(".row-info").forEach(row=>{
        row.style.display="none";
    });

    try{
        let response= await axios.get(baseURL+`q=${city.toLowerCase()}`+`&appid=${apiKey}`+`&units=metric`);
        console.log(baseURL+`&${city}`+`&apiid=${apiKey}`);
        console.log(response.data);

        let imgSrc = `assets/${response.data.weather[0].main}.png`;

        console.log(imgSrc);

        // Creating a new Image object to check if the file exists
        let img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            weatherImg.children[0].setAttribute("src", imgSrc);
        };
        img.onerror = () => {
            weatherImg.children[0].setAttribute("src", `assets/Clear.png`);
        };
    
        temperature.innerHTML=`${response.data.main.temp} <div class="degree"></div> C`;
        weatherDescription.children[0].innerText=`${response.data.weather[0].main}`;
        weatherDescription.children[1].innerHTML=`${response.data.main.temp_min} <div class="degree" style="height: 3px; width: 3px; margin: 2px;"></div> C / ${response.data.main.temp_max} <div class="degree" style="height: 3px; width: 3px; margin: 2px;"></div> C`;
        cityDisplay.innerText=`${response.data.name}`;

        humidity.innerText=`${response.data.main.humidity} %`;
        windSpeed.innerText=`${response.data.wind.speed} Km/h`;
    
        row4.children[0].children[2].innerHTML=`${response.data.main.feels_like} <div class="degree" style="height: 3px; width: 2px; margin: 2px;"></div> C`;
        row4.children[1].children[2].innerText=`${response.data.main.pressure} mb`;
        row4.children[2].children[2].innerText=`${response.data.main.sea_level} m`;
        row4.children[3].children[2].innerText=`${response.data.main.grnd_level} m`;
        row4.children[4].children[2].innerText=`${response.data.visibility/1000} Km`;
    }
    catch(error){
        console.error("Error fetching weather data:", error);
        alert("Error fetching weather data:", error);
    }
    finally{
        // Hide loading and show content after fetching
        loaderBox.style.display = "none"; 
        document.querySelectorAll(".row-info").forEach(row=>{
            row.style.display="flex";
        });
        document.querySelector(".row4").style.display="grid";
    }

}