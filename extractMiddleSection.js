let string = "</b><br>Items: Escape Rooms (3 rooms total; THEME: Patient Zero, School of Wizardry, and Snow Globe<br><font color=\"red\">(THEMES: Patient Zero, School of Wizardry and Snow Globe)</font> <br>Purchaser: University of Dubuque (Dubuque, Iowa)<br>Performance Location: Rooms 206, 207, 208        (Heritage Center)<br>Performance Date: 2021-10-29<font color=\"red\"></font> <br>Performance Time: 6:00PM-10:00PM (Event length 4 hours)<font color="; 



let preString = "Purchaser: ";
let searchString = "<br>";

function getCellContents(preString, searchString){
	let preIndex = string.indexOf(preString);
	let searchIndex = preIndex + string.substring(preIndex).indexOf(searchString);
  preIndex = preIndex + preString.length;
	return string.slice(preIndex, searchIndex);
}

extracted = getCellContents(preString, searchString)

$('body').append(extracted);