//Keeping USD and INR as default in selector
let fromSelector=document.getElementById("from-currency");
let toSelector=document.getElementById("to-currency");

document.addEventListener("DOMContentLoaded", () => {
    fromSelector.value="USD";
    toSelector.value="INR";
    fromSelector.previousElementSibling.setAttribute("src", `${countryBaseURL}US/flat/64.png`);
    toSelector.previousElementSibling.setAttribute("src", `${countryBaseURL}IN/flat/64.png`);
});

//Updating the default exchange rate when the page loads for the USD to INR
window.addEventListener("load", ()=>{
    updateExchange();
})


//-------------------------------------------------------------------------------------------------------------------------------------------------
//Changing the map based on the country selected 
let selectArea=document.querySelectorAll(".selector");
let countryBaseURL="https://flagsapi.com/";

updateFlag();

function updateFlag(){
    selectArea.forEach(selector => {
        selector.addEventListener("change", async function (){
            let country=this.value;
            let countryCode=countryList[country];
            await this.previousElementSibling.setAttribute("src", `${countryBaseURL}${countryCode}/flat/64.png`);
        })
    });
}


//-------------------------------------------------------------------------------------------------------------------------------------------------
//Giving all the country options in the selector

//iterating over all the values in the countryList and creating its option in the selector
for(let key in countryList){
    selectArea.forEach(selector=> {
        let option=document.createElement("option");
        option.innerText=`${key}`;
        option.value=`${key}`;
        selector.appendChild(option);
    })
}


//-------------------------------------------------------------------------------------------------------------------------------------------------
//Getting conversion rates

let baseURL="https://latest.currency-api.pages.dev/v1/currencies"
let btn=document.querySelector("#convert-button");

btn.addEventListener("click", (evt)=>{
    updateExchange();
})

//Updating exchange rate and displaying 
async function updateExchange(){

    let amount=document.querySelector("#amount").value;
    
    let URL=`${baseURL}/${fromSelector.value.toLowerCase()}.json`;
    let response= await fetch(URL);

    let data= await response.json();
    let rate= await data[fromSelector.value.toLowerCase()][toSelector.value.toLowerCase()];

    let finalAmount=rate*amount;
    let msg=document.querySelector("#msg");
    msg.innerText=`${amount} ${fromSelector.value} = ${finalAmount} ${toSelector.value}`;

}


//-------------------------------------------------------------------------------------------------------------------------------------------------
//Interchanging Funcion

let interchangeButton=document.querySelector(".middle");

interchangeButton.addEventListener("click", function (){

    this.classList.toggle("flipped");

    let temp=fromSelector.value;
    fromSelector.value=toSelector.value;
    toSelector.value=temp;
    
    fromSelector.previousElementSibling.setAttribute("src", `${countryBaseURL}${countryList[fromSelector.value]}/flat/64.png`);
    toSelector.previousElementSibling.setAttribute("src", `${countryBaseURL}${countryList[toSelector.value]}/flat/64.png`);

})