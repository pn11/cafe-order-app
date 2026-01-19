// Google Apps Script Web App Code
// Deploy this as a web app with execute permissions set to "Anyone"

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
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };

  if (method === 'OPTIONS') {
    return createResponse('', headers);
  }

  if (method === 'POST') {
    try {
      // Parse the incoming data
      const data = JSON.parse(e.postData.contents);

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

      return createResponse(JSON.stringify(response), headers);

    } catch (error) {
      // Return error response
      const errorResponse = {
        success: false,
        error: error.toString(),
        message: 'Failed to submit order'
      };

      return createResponse(JSON.stringify(errorResponse), headers);
    }
  }

  if (method === 'GET') {
    const response = {
      message: 'Cafe Order App - Google Apps Script Web App',
      status: 'active'
    };
    return createResponse(JSON.stringify(response), headers);
  }
}

function createResponse(content, headers) {
  const output = ContentService.createTextOutput(content);
  output.setMimeType(ContentService.MimeType.JSON);

  // Set CORS headers
  Object.keys(headers).forEach(key => {
    output.setHeaders({[key]: headers[key]});
  });

  return output;
}