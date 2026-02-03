#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR}/.."

ACCESS_QR="${PROJECT_ROOT}/access-qr.png"
ORDER_QR="${PROJECT_ROOT}/order-sheet-qr.png"
OUTPUT_PDF="${PROJECT_ROOT}/qr-codes.pdf"

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
  echo "Error: ImageMagick is not installed."
  echo "Install with: brew install imagemagick"
  exit 1
fi

# Check if QR code files exist
if [ ! -f "$ACCESS_QR" ]; then
  echo "Error: $ACCESS_QR not found. Run generate-token.sh first."
  exit 1
fi

if [ ! -f "$ORDER_QR" ]; then
  echo "Error: $ORDER_QR not found. Run generate-token.sh first."
  exit 1
fi

# A4 landscape size in pixels at 300 DPI: 3508 x 2480
A4_WIDTH=3508
A4_HEIGHT=2480
QR_SIZE=800
PADDING=100

# Calculate positions (left half and right half)
LEFT_X=$(( A4_WIDTH / 4 - QR_SIZE / 2 ))
RIGHT_X=$(( A4_WIDTH * 3 / 4 - QR_SIZE / 2 ))
CENTER_Y=$(( A4_HEIGHT / 2 - QR_SIZE / 2 - 50 ))

# Create A4 PDF with both QR codes
magick -size ${A4_WIDTH}x${A4_HEIGHT} xc:white \
  \( "$ORDER_QR" -resize ${QR_SIZE}x${QR_SIZE} \) -geometry +${LEFT_X}+${CENTER_Y} -composite \
  \( "$ACCESS_QR" -resize ${QR_SIZE}x${QR_SIZE} \) -geometry +${RIGHT_X}+${CENTER_Y} -composite \
  -font Helvetica -pointsize 60 \
  -draw "text $(( LEFT_X + QR_SIZE/2 - 150 )),$(( CENTER_Y + QR_SIZE + 80 )) 'Order Sheet'" \
  -draw "text $(( RIGHT_X + QR_SIZE/2 - 200 )),$(( CENTER_Y + QR_SIZE + 80 )) 'Order from here'" \
  -density 300 -units PixelsPerInch \
  "$OUTPUT_PDF"

echo ""
echo "PDF created: $OUTPUT_PDF"
echo ""
echo "Layout:"
echo "  Left:  Order Sheet QR (for staff)"
echo "  Right: Access QR (for customers)"
echo ""
