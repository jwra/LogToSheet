"use strict";

/**
 * Lightweight logger that writes messages to a Google Sheet.
 *
 * @param {Object} options - Configuration options.
 * @param {string} options.sheet - Target sheet name.
 * @param {string} [options.timeZone="UTC"] - Time zone for timestamp.
 */
class LogToSheet {
  constructor(options) {
    if (!options || !options.sheet) {
      throw new Error("LogToSheet requires a 'sheet' option.");
    }

    this.sheetName = options.sheet;
    this.timeZone = options.timeZone || "UTC";
    this.spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    this.sheet = this.spreadsheet.getSheetByName(this.sheetName);
    this.logs = [];
    this.maxBuffer = 500;
  }

  /**
   * Queues a message for logging.
   * @param {*} log - The message to log.
   */
  insert(log) {
    if (log == null) return;
    var timestamp = Utilities.formatDate(new Date(), this.timeZone, "yyyy-MM-dd HH:mm:ss");
    this.logs.push([timestamp, log]);
    if (this.logs.length >= this.maxBuffer) {
      this.flush();
    }
  }

  /**
   * Writes queued logs to the sheet.
   */
  flush() {
    if (this.logs.length === 0) return;
    if (this.sheet == null) {
      this.sheet = this.spreadsheet.insertSheet(this.sheetName);
    }
    var lastRow = this.sheet.getLastRow() + 1;
    this.sheet.insertRowsAfter(lastRow, this.logs.length);
    var range = this.sheet.getRange(lastRow, 1, this.logs.length, this.logs[0].length);
    range.setValues(this.logs);
    this.logs = [];
  }
}