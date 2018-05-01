var xhr; //define the global variable to process the AJAX request
function callDivChange(){
    xhr = new XMLHttpRequest();
    xhr.open("GET", "test2.html", true);
    xhr.onreadystatechange = processDivChange;
    try {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    catch (e){
    }
    xhr.send();
}

function processDivChange(){
if (xhr.readyState < 4)
        document.getElementById('div1').innerHTML = "Loading..";
    else if (xhr.readyState === 4) {
        if (xhr.status == 200 && xhr.status < 300)
            document.getElementById('div1').innerHTML = xhr.responseText;
    }
}