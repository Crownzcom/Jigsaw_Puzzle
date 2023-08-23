function timeToSeconds(time) {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
}

function secondsToTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function validateRequest(e) {
    if (!e || !e.postData || !e.postData.contents) {
        Logger.log("postData or contents is missing in the request");
        return false;
    }

    const data = JSON.parse(e.postData.contents);
    if (!data.name || !data.email || !data.scores) {
        Logger.log("Required data fields missing");
        return false;
    }

    return data;
}

function writeToSheet(data) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const records = sheet.getRange(2, 1, sheet.getLastRow(), 4).getValues(); // Updated range to consider the new column
    
    const existingRecordIndex = records.findIndex(record => record[1] === data.email);
    const scoresInSeconds = timeToSeconds(data.scores);
    const scoresInHMS = secondsToTime(scoresInSeconds);  // Convert the scores to HH:MM:SS format

    if (existingRecordIndex !== -1) {
        // Email found
        const existingScore = records[existingRecordIndex][2];

        if (scoresInSeconds < existingScore) { // Check if the new score is better (lower time)
            sheet.getRange(existingRecordIndex + 2, 3).setValue(scoresInSeconds); // Update only the score
            sheet.getRange(existingRecordIndex + 2, 4).setValue(scoresInHMS); // Update the HH:MM:SS format score
        }
    } else {
        // Email not found, append new data
        sheet.appendRow([data.name, data.email, scoresInSeconds, scoresInHMS]);
    }
}

function fetchTop5() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    rows.shift();  // remove header row
    rows.sort((a, b) => a[2] - b[2]);  // Sort by scores in ascending order

    return rows.slice(0, 5).map((row, index) => {
        return {
            position: index + 1,
            name: row[0],
            scores: secondsToTime(row[2])
        };
    });
}

function doPost(e) {
    const data = validateRequest(e);
    
    if (!data) {
        return ContentService.createTextOutput("Invalid request")
            .setMimeType(ContentService.MimeType.TEXT);
    }

    writeToSheet(data);
    const top5 = fetchTop5();

    return ContentService.createTextOutput(JSON.stringify(top5))
        .setMimeType(ContentService.MimeType.JSON);
}