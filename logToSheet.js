"use strict";

/**
 * Lightweight logger that writes messages to a Google Sheet.
 *
 * @param {Object} options - Configuration options.
 * @param {string} options.sheet - Target sheet name.
 * @param {string} [options.timeZone="UTC"] - Time zone for timestamp.
 * @param {string} [options.spreadsheetId] - Optional spreadsheet ID to log to.
 * @param {number} [options.maxBuffer=500] - Max logs to buffer before auto flush.
 */
class LogToSheet {
  constructor(options) {
    if (!options || !options.sheet) {
      throw new Error("LogToSheet requires a 'sheet' option.");
    }

    this.sheetName = options.sheet;
    this.timeZone = options.timeZone || "UTC";
    if (options.spreadsheetId) {
      this.spreadsheet = SpreadsheetApp.openById(options.spreadsheetId);
    } else {
      this.spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    this.maxBuffer = 500;
    if (options.maxBuffer !== undefined) {
      if (!Number.isInteger(options.maxBuffer) || options.maxBuffer <= 0) {
        throw new Error("The 'maxBuffer' option must be a positive integer.");
      }
      this.maxBuffer = options.maxBuffer;
    }

    this.sheet = this.spreadsheet.getSheetByName(this.sheetName);
    this.logs = [];
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
   * Logs a message with a specific level.
   * @param {string} level - The log level.
   * @param {*} message - The message to log.
   * @private
   */
  _logWithLevel(level, message) {
    if (message == null) return;
    var timestamp = Utilities.formatDate(new Date(), this.timeZone, "yyyy-MM-dd HH:mm:ss");
    this.logs.push([timestamp, level, String(message)]);
    if (this.logs.length >= this.maxBuffer) {
      this.flush();
    }
  }

  /** Log a message at INFO level */
  info(message) {
    this._logWithLevel("INFO", message);
  }

  /** Log a message at DEBUG level */
  debug(message) {
    this._logWithLevel("DEBUG", message);
  }

  /** Log a message at WARN level */
  warn(message) {
    this._logWithLevel("WARN", message);
  }

  /** Log a message at ERROR level */
  error(message) {
    this._logWithLevel("ERROR", message);
  }

  /**
   * Writes queued logs to the sheet.
   */
  flush() {
    if (this.logs.length === 0) return;
    if (this.sheet == null) {
      this.sheet = this.spreadsheet.getSheetByName(this.sheetName) || this.spreadsheet.insertSheet(this.sheetName);
    }

    // Add header when empty and using level logs
    if (this.sheet.getLastRow() === 0 && this.logs[0].length === 3) {
      this.sheet.appendRow(['Timestamp', 'Level', 'Message']);
    }

    var lastRow = this.sheet.getLastRow();
    if (lastRow + this.logs.length > this.sheet.getMaxRows()) {
      this.sheet.insertRowsAfter(lastRow, this.logs.length);
    }
    var colCount = this.logs[0].length;
    var range = this.sheet.getRange(lastRow + 1, 1, this.logs.length, colCount);
    range.setValues(this.logs);
    this.logs = [];
  }
}
