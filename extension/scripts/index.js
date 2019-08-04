
var activeTab;
var poacherTimer;
const timerButtons = [30, 60, 90, 120];

function loadButtons() {
    
    $("#poacher-actions").html("");
    $("#poacher-message").text("How long do you want to go on Safari for?");
    
    for (var i = 0; i < timerButtons.length; i++) {
        $("#poacher-actions").append('<div class="poacher-button" id="tabs-' + timerButtons[i] + '"> ' + timerButtons[i] + ' Minutes </div>')
    }
    
}

function loadTimer() {
    
    chrome.alarms.get(alarmName, function(alarm) {
        
        if (alarm == null) { 
            loadButtons(); 
            return
        }
        
        $("#poacher-actions").html('<div class="poacher-timer" id="poacher-timer"></div><div class="poacher-stop" id="poacher-stop">Stop Hunting</div>');
        $("#poacher-message").text("Gone hunting...");
        
        countDown(alarm.scheduledTime);
        poacherTimer = setInterval(function() { countDown(alarm.scheduledTime); }, 1000);

    });
    
}

function countDown(endTime) {
    
    var timeNow = new Date().getTime();
    var timeDistance = endTime - timeNow;
    
    if (timeDistance < 0) {
        clearInterval(poacherTimer);
        $("#poacher-timer").text("00:00");
        return
    }
    
    var timeMinutes = Math.floor(timeDistance / (1000 * 60));
    var timeSeconds = Math.ceil((timeDistance % (1000 * 60)) / 1000);
    
    if (timeSeconds == 60) {
        timeSeconds = 0;
        timeMinutes += 1;
    }
    
    $("#poacher-timer").text(padTime(timeMinutes) + ":" + padTime(timeSeconds));
    
}

function padTime(passedTime) {
    
    stringTime = String(passedTime);
    
    if (stringTime.length < 2) {
        return "0" + stringTime;
    } else {
        return stringTime;
    }
    
}

$(document).on("click", ".poacher-button", function() {
    
    timerLength = event.target.id.split("-")[1];
    console.log("Alarm created: " + timerLength + " seconds");
    chrome.alarms.create(alarmName, { "when": Date.now() + (timerLength * 60000) });
    
    loadTimer();
    
});

$(document).on("click", "#poacher-stop", function() {
    
    chrome.alarms.clear(alarmName, function(cleared) { return });
    clearInterval(poacherTimer);
    loadTimer();
    
});

$(document).ready(function() {

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) { 
    
        activeTab = tabs[0];
        alarmName = "poacher-" + activeTab.id;
        loadTimer()

    });

});

