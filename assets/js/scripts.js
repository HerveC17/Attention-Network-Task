var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var ageOfPatient;
var isChildVersion=false;
const minAgeAuthorized=5;   // Youngest age of a patient (5 years)
var dataToSendToANT;

/* ************************************ */
/*                                      */
/*   Pass data to the experiment page   */
/*                                      */
/*     Hervé CACI:  July 27th, 2021     */
/*                                      */
/* ************************************ */
//
//   1. File storage to be modified later
// x 2. Same format for date and dob
// x 3. Output parameters to a PDF page 
//   4. Code to be optimized

function passData() {

    // Get center where study is conducted & doctor's name
    let centerOfStudy=document.getElementById('site').value.toString().toLowerCase();
    centerOfStudy=centerOfStudy.slice(0,1).toUpperCase()+
        centerOfStudy.slice(1,centerOfStudy.length).toLowerCase();
    let doctorName=document.getElementById('examinateur').value.toString().toUpperCase();
    
    // Get patient's first and last names, date of birth & gender
    //
    let lastName = document.getElementById('lName').value.toUpperCase();
    let firstName = document.getElementById('fName').value.slice(0,1).toUpperCase() +
                    document.getElementById('fName').value.slice(1,2).toLowerCase();
    let dateOfBirth=dobPickerId.value.toLocaleString('fr-FR'); // 2016-08-01
    let dateOfBirthDay=dateOfBirth.substring(8,10);
    let dateOfBirthMonth=dateOfBirth.substring(5,7);
    let dateOfBirthYear=dateOfBirth.substring(0,4);
    dateOfBirth = dateOfBirthDay + "-" + dateOfBirthMonth + "-"+ dateOfBirthYear;
    let sexeRadio = document.getElementsByName('gender');
    let sexe="Masculin";
    if (sexeRadio[1].checked) { sexe="Feminin"; }
    
    // File name shall reflect the patient's characteristics:
    //    LastName (3 chars) + firstName (2 chars) + passationDate (8 chars)
    //    + passationTime (4 chars) + version (A=Adult / c=child) + sex (M/F)
    // 
    todayDate=new Date();
    let todayMonth=(todayDate.getMonth()+1).toString();
    if (todayDate.getMonth()<9) { todayMonth='0'+todayMonth; }  // 2 characters for Month
    let todayDay=todayDate.getDate().toString();
    if (todayDay.length<2) { todayDay = "0"+todayDay; }         // 2 characters for Day
    let todayHour=todayDate.getHours().toString();
    if (todayHour.length<2) { todayHour = "0"+todayHour; }
    let todayMin=todayDate.getMinutes().toString();
    if (todayMin.length<2) { todayMin = "0"+todayMin; }
    let passationDate=todayDay + "-" + todayMonth + "-" + todayDate.getFullYear();
    let passationTime=todayHour + ":" + todayMin;
    let fileName = lastName + firstName /*
    */ + '_' + todayDate.getFullYear() + todayMonth + todayDay /*
    */ + '_' + passationTime;
    let whatVersion="Child";
    if (isChildVersion) {
        fileName = fileName + "_c";
        }
        else {
            fileName = fileName + "_A"; 
            whatVersion = "Classical";
        }
    if (sexe=="Masculin") { fileName = fileName + "M"; }
        else { fileName = fileName + "F"; }
    fileName = fileName + '.txt'
   
    window.jsPDF = window.jspdf.jsPDF;
    var theReportPDF = new jsPDF('p', 'pt', 'a4'); // orientation: paysage, unit: point, size: 210x297mm)
    //
    var listOfFonts= theReportPDF.getFontList();
    console.log(listOfFonts);
    //
    theReportPDF.setFont("Times", "Bold");
    theReportPDF.setFontSize('16');
    theReportPDF.text(297,30, "ANTeye", "center");
    theReportPDF.setFontSize('10');
    theReportPDF.text(297, 45, "Thibault CACI & Hervé CACI - 2021", "center");
    //
    theReportPDF.setFontSize('12');
    let lines=["Nom:", "Prénom:", "Sexe:", "Date de naissance:",
                "Date de passation:", "Heure de passation:", "Age:",
                "Centre:", "Examinateur:",
                "Nom du fichier:"];
    for (let i=0; i<10; i++) {
        theReportPDF.text(20, 80+15*i, lines[i]);
    }
    //
    theReportPDF.setFont("Times", "Normal");
    theReportPDF.text(50,80,lastName);
    theReportPDF.text(70,95,firstName);
    theReportPDF.text(50,110,sexe);
    theReportPDF.text(120,125,dateOfBirth);
    theReportPDF.text(120,140,passationDate);
    theReportPDF.text(125,155,passationTime);
    theReportPDF.text(50,170,ageOfPatient);
    theReportPDF.text(65,185,centerOfStudy);
    theReportPDF.text(95,200,doctorName);
    theReportPDF.text(105,215,fileName);
    //
    theReportPDF.setFont("Times", "Bold");
    theReportPDF.text(20, 230, "Résultats du test Attention Network Test (" + whatVersion + " version)");
    theReportPDF.text(20, 500, "Résultats de l'eye-tracking");
    //
    theReportPDF.setFont("Times", "Italic"); // (fontName, fontStyle)
    theReportPDF.setLineHeightFactor(1.5);
    theReportPDF.setFontSize(10);
    theReportPDF.text(20,795,'Test proposé dans le cadre de l\'étude: "ThyrADHD - Profil thyroïdien anormal chez les enfants et adolescents avec un Trouble du\nDéficit de l\’Attention avec Hyperactivité (TDAH)".\nInvestigateur Principal: Dr Hervé CACI - 2021');
    //
    theReportPDF.output('dataurlnewwindow');

    // Populate storage and go to the next page
    //
    localStorage.setItem('examinateur', doctorName);
    localStorage.setItem('site', centerOfStudy);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('gender', sexe);
    localStorage.setItem('dob', ageOfPatient);
    localStorage.setItem('version', isChildVersion);
    localStorage.setItem('fileName', fileName);

    // A modifier plus tard
    //

    let data = 
        '\rExaminateur: ' + document.getElementById('examinateur').value + ' \r\n' +
        'Site: ' + document.getElementById('site').value + ' \r\n' +
        'Nom: ' + document.getElementById('lName').value.toUpperCase() + ' \r\n' +
        'Prenom: ' + document.getElementById('fName').value.toUpperCase() + ' \r\n' +
        'Sexe: ' + sexe + ' \r\n' +
        'Date de passation: ' + todayDay + '-' + todayMonth + '-' + todayDate.getFullYear() + ' \r\n' +
        'Heure de passation: ' + todayHour + ':' + todayMin + '\r\n' +
        'Date de naissance: ' + dateOfBirthDay + '-' + dateOfBirthMonth + '-' + dateOfBirthYear + '\r\n' +
        'Age: ' + ageOfPatient + ' \r\n' +
        'Child version: ' + isChildVersion + ' \r\n'
    
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
    
    // Go to next page (JSPsych)
    //
    window.location.href = "fromGit/index.html";
}

/* ******************************************************** */
/*                                                          */
/*    Calculate patient's age and set boolean according to  */
/*     the version of the ANT to be used: child/classical   */
/*                                                          */
/*                Hervé CACI: July 22nd, 2021               */
/*                                                          */
/* ******************************************************** */

function calculateAge() {
    // convert user input value into date object and get the
    // difference from current date
    //
    let dobDate = new Date(document.getElementById("dobPickerId").value);
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
//   let text = "";
//    if (years) { text = years + (years > 1 ? " ans" : " an"); }
    let text = years + (years > 1 ? " ans, " : " an, ");
    if (months) {
//     if (text.length) { text = text + ", "; }
      text = text + months + (months > 1 ? " mois et " : " mois et ");
    } else { text = text + " 0 mois et "; }
    if (days) {
//     if (text.length) { text = text + ", "; }
      text = text + days + (days > 1 ? " jours" : " jour");
    } else { text = text + " 0 jour"; }
    //
    ageOfPatient=text;
    if (years>=11) { isChildVersion=false; }
        else { isChildVersion=true; }
    return [ageOfPatient, isChildVersion];
}

/* ******************************************** */
/*                                              */
/*   Set the value and the upper end of the     */
/*   date range to today's date minus 5 years.  */
/*                                              */
/*          Hervé CACI: July 24th, 2021         */
/*                                              */
/* ******************************************** */

function setTodayAndMaxDate() {
    let today = new Date();
    let dd = today.getDate();
    if(dd<10) { dd='0'+dd }
    let mm = today.getMonth()+1; //January is 0 so need to add 1 to make it 1!
    if(mm<10){ mm='0'+mm }
    let yyyy = today.getFullYear()-minAgeAuthorized;
    let todayAndMaxDate = yyyy + '-' + mm + '-' + dd;
    document.getElementById("dobPickerId").setAttribute("value", todayAndMaxDate);
    document.getElementById("dobPickerId").setAttribute("max", todayAndMaxDate);
}

/* ************************************ */
/*                                      */
/*    Enable/Disable the GO button      */
/*    depending of fields empty or not  */
/*                                      */
/*       Hervé CACI: July 27th, 2021    */
/*                                      */
/* ************************************ */

function infoModified() {
    let genders = document.getElementsByName("gender");
    let theGOButton = document.getElementById("buttonGO");
    let examinateurSelected = document.getElementById("examinateur").value;
    let siteSelected = document.getElementById("site").value;
    if ((document.getElementById("lName").value.length==3) && (document.getElementById("fName").value.length==2)
        && ((genders[0].checked==true) || (genders[1].checked==true)) && (examinateurSelected!="0") && (siteSelected!="0")) {
            theGOButton.disabled = false;
        }
    else { 
        theGOButton.disabled = true;
    }
    let ageAndVersion = calculateAge();
    let theAge = ageAndVersion[0];
    let theVersion = ageAndVersion[1];
    if (theVersion) { theAge = theAge + ' -- Child version'; }
        else { theAge = theAge + ' -- Classical version'; }
    document.getElementById("ageAndVersion").innerText = theAge;
}

function getExaminateur() {
    examinateur2 = JSON.parse(examinateur2);
    var x = document.getElementById("examinateur");
    examinateur2.forEach(function(entry) {
        var option = document.createElement("option");
        option.text = entry.nom + " " + entry.prenom;
        x.add(option);
    });  
}

function getSite() {
    site2 = JSON.parse(site2);
    var x = document.getElementById("site");
    site2.forEach(function(entry) {
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
