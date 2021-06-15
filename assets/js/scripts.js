var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var calculatedAge;

function fnCalculateAge() {
    var userDateinput = document.getElementById("birth").value;
    console.log(userDateinput);
    // convert user input value into date object
    var birthDate = new Date(userDateinput);
    console.log(" birthDate" + birthDate);
    // get difference from current date;
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    document.getElementById('Age').value = calculatedAge + " ans";
}

// Test de la sauvegarde des data
let saveFile = () => {
    const examinateur = document.getElementById('examinateur');
    const site = document.getElementById('site');
    const lName = document.getElementById('lName');
    const fName = document.getElementById('fName');
    const sexe = document.getElementById('sexe');
    const birth = document.getElementById('birth');
    const age = document.getElementById('Age');

    let data = 
        '\r Examinateur: ' + examinateur.value + ' \r\n ' +
        'Site: ' + site.value + ' \r\n ' +
        'lName: ' + lName.value + ' \r\n ' +
        'fName: ' + fName.value + ' \r\n ' +
        'sexe: ' + sexe.value + ' \r\n ' +
        'birth: ' + birth.value + ' \r\n ' +
        'age: ' + age.value;

    const textToBLOB = new Blob([data], {type : 'text/plain' });
    const sFileName = 'formData.txt';

    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }

    newLink.click(); 
}

function getExaminateur() {
    examinateur2 = JSON.parse(examinateur2);
    console.log(examinateur2);
    var x = document.getElementById("examinateur");
    examinateur2.forEach(function(entry) {
        console.log(entry);
        var option = document.createElement("option");
        option.text = entry.nom + " " + entry.prenom;
        x.add(option);
    });  
}

function getSite() {
    site2 = JSON.parse(site2);
    console.log(site2);
    var x = document.getElementById("site");
    site2.forEach(function(entry) {
        console.log(entry);
        var option = document.createElement("option");
        option.text = entry.nom;
        x.add(option);
    });  
}

function GenerateTable() {
    //Build an array containing Customer records.
    examinateur2 = JSON.parse(examinateur2);

    //Create a HTML Table element.
    var table = document.createElement("TABLE");
    table.id = "examinateurTable";
    table.border = "1";

    //Get the count of columns.
    var columnCount = Object.keys(examinateur2[0]).length;

    //Add the header row.
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = Object.keys(examinateur2[0])[i];
        row.appendChild(headerCell);
    }

    //Add the data rows.
    for (var i = 0; i < examinateur2.length; i++) {
        row = table.insertRow(-1);
        for (var j = 0; j < columnCount; j++) {
            var cell = row.insertCell(-1);
            var textbox = document.createElement("input");
            textbox.id = "Examinateur" + i + "," + j;
            textbox.type = "text";
            textbox.value = Object.values(examinateur2[i])[j];
            cell.innerHTML = "";
            cell.appendChild(textbox);
        }
    }

    var dvTable = document.getElementById("tablediv");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}

function saveTable() {
    xSize = $("table tbody tr th").length;
    ySize = $("table tbody tr").length - 1;

    for (var i = 0; i < ySize; i++) {
        for (var j = 0; j < xSize; j++) {
            if (i==0) {
                
            }
            console.log(i + " " + j);
            value = document.getElementById("Examinateur" + i + "," + j).value;
            console.log(value + " " + i + j);
        }
    }
}