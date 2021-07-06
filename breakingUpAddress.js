const stateNames = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming', 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];

let zip = "";
let zipString = "";
let cityString="";
let stateString="";


const msg = "117 Evergreen Drive Box 600, Loretto, Pennsylvania 15940-1111";

function getZip(msg) {
/* returns 5 or 10 digit zip code depending on what is input*/
    let last5 = msg.slice(-5);
    let dashTest = last5.substring(0,1);

    if (dashTest == "-") {
        //  answer="correct";
        zip = msg.slice(-10);
        }  else {
            zip=last5;
        }
    return zip;
}


function getState(msg, zip) {
    /*HAVE TO RUN ZIP FIRST!!! */

    //first remove the zip
    let zipIndex = msg.indexOf(zip);
    let zipStripped = msg.substring(0,zipIndex);

    //then reverse the string
    let rvs = zipStripped.split('').reverse().join('');

    //Find the first comma and retrieve that state portion
    let commaIndex= rvs.indexOf(',');
    let reversedState = rvs.slice(0,commaIndex);

    //reverse it back and verify it's the state
    let state = reversedState.split('').reverse().join('');

    //return the state
    return state;
}


function getCity(msg, state){
    /*HAVE TO RUN STATE & ZIP FIRST!!! */
    /* CAN CLEAN UP CODE LATER - DO IT ALL IN ONE FUNCTION & RETURNING AN ARRAY OR OBJ*/

    //first remove the state onwards
    let stateIndex = msg.indexOf(state);
    let stateStripped = msg.substring(0,stateIndex-1); //might need to strip a comma
    console.log("stateIndex: ",stateIndex);
    console.log("stateStripped:",stateStripped);

    //then reverse the string
    let rvs = stateStripped.split('').reverse().join('');

    //Find the first comma and retrieve that city portion
    let commaIndex= rvs.indexOf(',');
    let reversedCity = rvs.slice(0,commaIndex);

    //reverse it back and verify it's the state
    city = reversedCity.split('').reverse().join('');

    //return the state
    return city;
}

zip = getZip(msg);
zipString = `Zip: ${zip}`;

state = getState(msg,zip);
stateString = `State: ${state}`;

city = getCity(msg,state);
cityString=`City: ${city}`;


document.getElementById("city").innerText=cityString;
document.getElementById("state").innerText=state;
document.getElementById("zip").innerText=zipString;