class LogToSheet {
  constructor(options) {
    this.sheetName = options.sheet;
    this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.sheetName);
    this.logs = [];
  }

  insert(log) {
    if(log) {
      let timestamp = Utilities.formatDate(new Date(), "UTC", "yyyy-MM-dd HH:mm:ss"); 
      this.logs.push([timestamp,log]);
    }
  }

  flush() {
    if(this.sheet == null) {
      this.sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(this.sheetName);
    }
    let lastRow = this.sheet.getLastRow() + 1;
    let range = this.sheet.getRange(lastRow, 1, this.logs.length, this.logs[0].length);
    this.sheet.insertRowsAfter(lastRow, this.logs.length);
    range.setValues(this.logs);
    this.logs = [];
  }
}