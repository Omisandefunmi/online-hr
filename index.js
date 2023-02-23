// Load the necessary APIs
google.load('auth', 'client', 'drive', 'sheets');

// Set up the Google API credentials
var CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
var API_KEY = 'YOUR_API_KEY_HERE';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest", "https://sheets.googleapis.com/$discovery/rest?version=v4"];
var SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets';

// Set up the web form fields
var formFields = [  {name: 'name', label: 'Full Name', type: 'text'},  {name: 'email', label: 'Email Address', type: 'email'},  {name: 'phone', label: 'Phone Number', type: 'tel'},  {name: 'resume', label: 'Resume', type: 'file'},  {name: 'github', label: 'GitHub Profile', type: 'url'},  {name: 'linkedin', label: 'LinkedIn Profile', type: 'url'},  {name: 'position', label: 'Position Applied For', type: 'text'},  {name: 'salary', label: 'Salary Expectations', type: 'number'},  {name: 'start_date', label: 'Available Start Date', type: 'date'},  {name: 'location', label: 'Preferred Work Location', type: 'text'}];

// Create the web form
var form = document.createElement('form');
form.setAttribute('method', 'post');
form.setAttribute('action', 'submit.php');

// Add the form fields to the form
formFields.forEach(function(field) {
  var label = document.createElement('label');
  label.setAttribute('for', field.name);
  label.innerHTML = field.label;
  var input = document.createElement('input');
  input.setAttribute('type', field.type);
  input.setAttribute('name', field.name);
  input.setAttribute('id', field.name);
  label.appendChild(input);
  form.appendChild(label);
});

// Add a submit button to the form
var submit = document.createElement('input');
submit.setAttribute('type', 'submit');
submit.setAttribute('value', 'Submit');
form.appendChild(submit);

// Add the form to the page
document.body.appendChild(form);

// Initialize the Google APIs
function init() {
  gapi.auth2.init({
    client_id: CLIENT_ID,
    api_key: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function() {
    console.log('Google API initialized.');
  }, function(error) {
    console.error('Error initializing Google API:', error);
  });
}

// Load the Google APIs
gapi.load('client:auth2', init);

// Handle form submission
form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Get the form data
  var formData = new FormData(form);
  
  // Create a new spreadsheet
  var spreadsheet = {
    properties: {
      title: 'Job Applications'
    },
    sheets: [{
      properties: {
        title: 'Applications',
        gridProperties: {
          rowCount: 1000,
          columnCount: formFields.length
        }
      }
    }]
  };
  
  // Create the spreadsheet
  gapi.client.sheets.spreadsheets.create({}, spreadsheet).then(function(response) {
    console.log('Spreadsheet created:', response.result);
    
    // Save the spreadsheet ID
    var spreadsheetId = response.result.spreadsheetId;
    
    // Add the headers to the sheet
    // var headerRow = form
