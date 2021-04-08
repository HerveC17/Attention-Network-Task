function fnCalculateAge() {
    var userDateinput = document.getElementById("birth").value;
    console.log(userDateinput);
    // convert user input value into date object
    var birthDate = new Date(userDateinput);
    console.log(" birthDate" + birthDate);
    // get difference from current date;
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    document.getElementById('Age').value=calculatedAge + " ans";
}

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