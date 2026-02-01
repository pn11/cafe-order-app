#!/bin/bash

set -e

BASE_URL="${1:-https://your-username.github.io/cafe-order-app}"

# Generate random token
TOKEN=$(openssl rand -hex 32)

echo ""
echo "=== Token Generation ==="
echo ""
echo "Generated Token: $TOKEN"

# Generate full URL with token
FULL_URL="${BASE_URL}?key=${TOKEN}"
echo ""
echo "Full URL: $FULL_URL"

# Generate QR code
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
QR_PATH="${SCRIPT_DIR}/../access-qr.png"

if command -v qrencode &> /dev/null; then
  qrencode -o "$QR_PATH" -s 10 "$FULL_URL"
  echo ""
  echo "QR Code saved to: $QR_PATH"

  # Print QR to terminal
  echo ""
  echo "QR Code (terminal):"
  echo ""
  qrencode -t UTF8 "$FULL_URL"
else
  echo ""
  echo "Warning: qrencode not installed. Install with: brew install qrencode"
  echo "Skipping QR code generation."
fi

# Generate apps-script-generated.js with token
OUTPUT_PATH="${SCRIPT_DIR}/../apps-script-generated.js"

cat > "$OUTPUT_PATH" << EOF
// Google Apps Script Web App Code
// Deploy this as a web app with execute permissions set to "Anyone"

// Authentication token - DO NOT share this file publicly
const AUTH_TOKEN = '${TOKEN}';

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
      // Validate token from query parameter
      const requestToken = e.parameter ? e.parameter.key : null;
      if (requestToken !== AUTH_TOKEN) {
        return createResponse(JSON.stringify({
          success: false,
          error: 'Unauthorized',
          message: 'Invalid or missing access token'
        }), headers);
      }

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
    // Check for token in query parameters
    const token = e.parameter ? e.parameter.token : null;
    const isApproved = token === AUTH_TOKEN;

    const response = {
      message: 'Cafe Order App - Google Apps Script Web App',
      status: 'active',
      approved: isApproved
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
EOF

echo ""
echo "Apps Script saved to: $OUTPUT_PATH"

echo ""
echo "=== Next Steps ==="
echo "1. Copy the contents of apps-script-generated.js to Google Apps Script"
echo "2. Deploy the Apps Script as a web app"
echo "3. Share the QR code (access-qr.png) with authorized users"
echo "4. Do NOT commit apps-script-generated.js or access-qr.png to git"
echo ""
