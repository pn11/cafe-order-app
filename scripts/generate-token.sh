#!/bin/bash

set -e

BASE_URL="${1:-https://pn11.github.io/cafe-order-app}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR}/.."

# Load ORDER_SHEET_ID from .env if it exists
if [ -f "${PROJECT_ROOT}/.env" ]; then
  ORDER_SHEET_ID=$(grep '^REACT_APP_ORDER_SHEET_ID=' "${PROJECT_ROOT}/.env" | cut -d'=' -f2)
fi

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

# Generate QR codes
QR_PATH="${PROJECT_ROOT}/access-qr.png"
ORDER_QR_PATH="${PROJECT_ROOT}/order-sheet-qr.png"

if command -v qrencode &> /dev/null; then
  # App access QR code
  qrencode -o "$QR_PATH" -s 10 "$FULL_URL"
  echo ""
  echo "App QR Code saved to: $QR_PATH"

  # Print QR to terminal
  echo ""
  echo "App QR Code (terminal):"
  echo ""
  qrencode -t UTF8 "$FULL_URL"

  # Order sheet QR code
  if [ -n "$ORDER_SHEET_ID" ]; then
    ORDER_SHEET_URL="https://docs.google.com/spreadsheets/d/${ORDER_SHEET_ID}"
    qrencode -o "$ORDER_QR_PATH" -s 10 "$ORDER_SHEET_URL"
    echo ""
    echo "Order Sheet URL: $ORDER_SHEET_URL"
    echo "Order Sheet QR Code saved to: $ORDER_QR_PATH"
    echo ""
    echo "Order Sheet QR Code (terminal):"
    echo ""
    qrencode -t UTF8 "$ORDER_SHEET_URL"
  else
    echo ""
    echo "Warning: ORDER_SHEET_ID not found in .env. Skipping order sheet QR code."
  fi
else
  echo ""
  echo "Warning: qrencode not installed. Install with: brew install qrencode"
  echo "Skipping QR code generation."
fi

# Update AUTH_TOKEN in apps-script-generated.js
OUTPUT_PATH="${SCRIPT_DIR}/../apps-script-generated.js"

if [ -f "$OUTPUT_PATH" ]; then
  sed -i '' "s/^const AUTH_TOKEN = '.*';$/const AUTH_TOKEN = '${TOKEN}';/" "$OUTPUT_PATH"
  echo ""
  echo "Updated AUTH_TOKEN in: $OUTPUT_PATH"
else
  echo ""
  echo "Error: $OUTPUT_PATH not found. Please create it first."
  exit 1
fi

echo ""
echo "=== Next Steps ==="
echo "1. Copy the contents of apps-script-generated.js to Google Apps Script"
echo "2. Deploy the Apps Script as a web app"
echo "3. Share access-qr.png with customers"
echo "4. Share order-sheet-qr.png with staff to view orders"
echo "5. Do NOT commit apps-script-generated.js or *-qr.png to git"
echo ""
