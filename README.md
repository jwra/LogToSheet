# LogToSheet
Lightweight in-sheet logging for Google Sheets. Intended to provide spreadsheet users with contextual information without having to navigate to Apps Script logs.

## Usage
Initialize a new instance of `LogToSheet`. The constructor accepts an options object. At a minimum you must provide the sheet name via the `sheet` option.
You can also optionally override the timestamp time zone with the `timeZone` option.
```
const log = new LogToSheet({
  sheet: "Logs",
  // optional: timezone used for timestamps
  timeZone: "America/Los_Angeles"
});
```
Insert new logs by calling the  ```insert``` method with 1 argument which is the value to log. 
```
log.insert("My first log");
```
Output the logs to the sheet by calling `flush`. `flush` will attempt to create
the output sheet if it does not already exist. `flush` is also automatically
invoked when more than 500 entries have been queued.
```
log.flush();
```
## Output Format
LogToSheet will output 2 columns to the sheet. The first column is a date time corresponding to the time of the log in ```yyyy-MM-dd HH:mm:ss``` format using the configured `timeZone` (defaults to UTC). The second column is the log.
## Example
```
const log = new LogToSheet({
    sheet: "Logs",
    timeZone: "America/Los_Angeles"
});

for(let i = 1; i <= 100; i++) {
  log.insert(`Demo ${i}`);
}

log.flush();
```
<img width="230" alt="Screenshot 2023-01-21 134153" src="https://user-images.githubusercontent.com/49938659/213867317-d355350c-ea0e-4b2f-94bc-1e7ae6a32dc7.png">

