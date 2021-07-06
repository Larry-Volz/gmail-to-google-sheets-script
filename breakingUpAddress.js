const msg = "117 Evergreen Drive Box 600, Loretto, Pennsylvania 15940-1111";

function getZip(msg) {

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

zip = getZip(msg);

let result = `Zip = ${zip}`;




// const msg = "117 Evergreen Drive Box 600, Loretto, Pennsylvania 15940-9704";

// let last5 = msg.slice(-5);
// let dashTest = last5.substring(0,1);

// let result = dashTest;


document.getElementById("display1").innerText=result;