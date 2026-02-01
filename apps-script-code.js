// Google Apps Script Web App Code
// Deploy this as a web app with execute permissions set to "Anyone"

// Authentication token - replace with your secret token
const AUTH_TOKEN = 'your-secret-token-here';

function doPost(e) {
  return handleRequest(e, 'POST');
}

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doOptions(e) {
  return handleRequest(e, 'OPTIONS');
}

function handleRequest(e, method) {
  if (method === 'OPTIONS') {
    return createResponse('');
  }

  if (method === 'POST') {
    try {
      // Parse the incoming data
      const data = JSON.parse(e.postData.contents);

      // Validate token from request body
      const requestToken = data.apiKey;
      if (requestToken !== AUTH_TOKEN) {
        return createResponse(JSON.stringify({
          success: false,
          error: 'Unauthorized',
          message: 'Invalid or missing access token'
        }));
      }

      // Your Google Sheets ID (replace with your actual ORDER_SHEET_ID)
      const SHEET_ID = '1GTFaQY2E9Rz8pY2-W_Xdv-bJJJBIvWRuaorS8QNGj8o';

      // Open the spreadsheet and get the first sheet
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      const sheet = spreadsheet.getSheets()[0]; // Gets first sheet (Sheet1)

      // Prepare the row data (JST)
      const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

      // Format items as "MenuName x Quantity" list
      const itemsList = data.items.map(item => item.name + ' x' + item.quantity).join(', ');

      const orderRow = [
        timestamp,
        data.customerName || '',
        itemsList,
        data.total,
        data.notes || '',
        'Pending'
      ];

      // Append the row to the sheet
      sheet.appendRow(orderRow);

      // Return success response
      const response = {
        success: true,
        message: 'Order submitted successfully',
        timestamp: timestamp
      };

      return createResponse(JSON.stringify(response));

    } catch (error) {
      // Return error response
      const errorResponse = {
        success: false,
        error: error.toString(),
        message: 'Failed to submit order'
      };

      return createResponse(JSON.stringify(errorResponse));
    }
  }

  if (method === 'GET') {
    // Check for token in query parameters
    const token = e.parameter ? e.parameter.token : null;
    const isApproved = token === AUTH_TOKEN;

    const response = {
      message: 'Cafe Order App - Google Apps Script Web App',
      status: 'active',
      approved: isApproved
    };
    return createResponse(JSON.stringify(response));
  }
}

function createResponse(content) {
  const output = ContentService.createTextOutput(content);
  output.setMimeType(ContentService.MimeType.JSON);
  // CORS headers are handled automatically by Apps Script when deployed with "Anyone" access
  return output;
}
