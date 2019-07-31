
chrome.alarms.onAlarm.addListener(function(alarm) {
    
    alarmDetails = alarm.name.split("-");
    chrome.tabs.remove(parseInt(alarmDetails[1]));
    
});