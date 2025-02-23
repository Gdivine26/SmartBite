function myFunction() {

const WATCH_CHANGE_WEBHOOK_URL = 'https://hook.us2.make.com/2cj7yfn7d1t6tih1vb1iypevb6u6lp9z';


const SHEET = 'Sheet1'; 
const RANGE = 'C:C';   

function watchChanges(e) {
    if (!WATCH_CHANGE_WEBHOOK_URL) {
        console.log('Webhook URL is missing');
        throw new Error('Enter WATCH_CHANGE_WEBHOOK_URL');
    }

    const sheet = e.source.getActiveSheet();
    if (SHEET && SHEET !== sheet.getName()) return;

    const rangeChanged = e.range.getA1Notation();
    if (!isWithinRange_(rangeChanged, RANGE)) return;

    if (!e.value || e.value !== "Yes") return;

    const rowNumber = e.range.getRow();
    const dataRange = sheet.getDataRange();
    const rowValues = sheet.getRange(rowNumber, 1, 1, dataRange.getLastColumn()).getValues()[0];

    const payload = {
        spreadsheetId: e.source.getId(),
        spreadsheetName: e.source.getName(),
        sheetId: sheet.getSheetId(),
        sheetName: sheet.getSheetName(),
        rangeA1Notation: rangeChanged,
        oldValue: e.oldValue,
        value: e.value,
        rowValues: rowValues
    };

    const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true 
    };

    try {
        const response = UrlFetchApp.fetch(WATCH_CHANGE_WEBHOOK_URL, options);
        console.log("Webhook Response Code:", response.getResponseCode());
        console.log("Webhook Response Content:", response.getContentText());
    } catch (error) {
        console.error("Webhook Error:", error.toString());
    }
}


}