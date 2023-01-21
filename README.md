# LogToSheet
Lightweight in-sheet logging for Google Sheets. Intended to provide spreadsheet users with contextual information without having to navigate to Apps Script logs.

## Usage
Initialize a new instance of LogToSheet. LogToSheet expects 1 argument, an object containing a key ```sheet```. The value of ```sheet``` is the name of the sheet where logs should be outputted. The sheet doesn't need to already exist. If it doesn't exist, the value you provide should meet Google Sheets' naming requirements.
```
const log = new LogToSheet({
  "sheet": "Logs"
});
```
Insert new logs by calling the  ```insert``` method with 1 argument which is the value to log. 
```
log.insert("My first log");
```
Output the logs to the sheet by calling ```flush```. Flush will attempt to create the output sheet. 
```
log.flush();
```
## Output Format
LogToSheet will output 2 columns to the sheet. The first column is a date time corresponding to the time of the log in ```yyyy-MM-dd HH:mm:ss``` format (timezone is UTC). The second column is the log.
## Example
```
const log = new LogToSheet({
    "sheet": "Logs"
});

for(let i = 1; i <= 100; i++) {
  log.insert(`Demo ${i}`);
}

log.flush();
```
<img width="230" alt="Screenshot 2023-01-21 134153" src="https://user-images.githubusercontent.com/49938659/213867317-d355350c-ea0e-4b2f-94bc-1e7ae6a32dc7.png">

