var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

let ageOfPatient;
let isChildVersion=false;

/* ******************************* **/
/*                                  */
/*    Calculate patient's age and   */
/*    copies it to HTML page        */
/*                                  */
/*    Hervé CACI: July 22nd, 2021   */
/*                                  */
/* ******************************* **/

function calculateAge() {
    // convert user input value into date object and get the
    // difference from current date
    //
    let dobDate = new Date(document.getElementById("birth").value);
    let nowDate = new Date(new Date().setHours(0, 0, 0, 0));
    let years = nowDate.getFullYear() - dobDate.getFullYear();
    let months = nowDate.getMonth() - dobDate.getMonth();
    let days = nowDate.getDate() - dobDate.getDate();
    //
    // Work out the difference in months and add those month to the DOB,
    // calculate the difference in milliseconds and convert it in days
    months += years * 12;
    if (days < 0) { months -= 1; }
    dobDate.setMonth(dobDate.getMonth() + months);
    days = Math.round((nowDate - dobDate) / 86400 / 1000);
    //
    // Now convert months back to years and months, and format the output
    //
    years = parseInt(months / 12);
    months -= (years * 12);
    let text = "";
    if (years) { text = years + (years > 1 ? " ans" : " an"); }
    if (months) {
      if (text.length) { text = text + ", "; }
      text = text + months + (months > 1 ? " mois" : " mois")
    }
    if (days) {
      if (text.length) { text = text + ", "; }
      text = text + days + (days > 1 ? " jours" : " jour")
    }
    //
    ageOfPatient=text;
    if (years>=11) { isChildVersion=false; }
        else { isChildVersion=true; }
    document.getElementById('Age').value = text;
}

// Test de la sauvegarde des data

function saveFile() { // saveFile = () => {
    const examinateur = document.getElementById('examinateur');
    const site = document.getElementById('site');
    const lastName = document.getElementById('lName');
    const firstName = document.getElementById('fName');
    const birth = document.getElementById('birth');
    const age = document.getElementById('Age');
    
    let sexeRadio = document.getElementsByName('gender');
    let sexe="Non renseigne";
    if (sexeRadio[0].checked) { sexe="Masculin"; }
        else if (sexeRadio[1].checked) { sexe="Feminin"; }

    let todayDate=new Date();

    let data = 
        '\r Examinateur: ' + examinateur.value + ' \r\n ' +
        'Site: ' + site.value + ' \r\n ' +
        'lName: ' + lastName.value + ' \r\n ' +
        'fName: ' + firstName.value + ' \r\n ' +
        'sexe: ' + sexe + ' \r\n ' +
        'Date de passation: ' + todayDate.toLocaleDateString() + ' \r\n ' +
        'Date de naissance: ' + birth.value + ' \r\n ' +
        'age: ' + age.value + ' \r\n ' +
        'Child version: ' + isChildVersion + ' \r\n'

    // File name reflects patient characteristics:
    //    LastName (3 chars) + firstName (2 chars) + passationDate (8 chars)
    //    + passationTime (4 chars) + version (A=Adult / c=child) + sex (M/F)
    // 
    let todayMonth=(todayDate.getMonth()+1).toString();
    if (todayDate.getMonth()<9) { todayMonth='0'+todayMonth; }
    let fileName = lastName.value.toUpperCase() + firstName.value.toUpperCase() /*
    */ + '_' + todayDate.getFullYear() + todayMonth + todayDate.getDate() /*
    */ + '_' + todayDate.getHours() + todayDate.getMinutes()
    if (isChildVersion) { fileName = fileName + "_c"; }
        else { fileName = fileName + "_A"; }
    if (sexe=="Masculin") { fileName = fileName + "M"; }
        else { fileName = fileName + "F"; }
    fileName = fileName + '.txt'
    
    const textToBLOB = new Blob([data], {type : 'text/plain' });
    let newLink = document.createElement("a");
    newLink.download = fileName;

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