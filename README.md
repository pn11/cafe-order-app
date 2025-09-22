# Cafe Mobile Order App

A React-based mobile ordering application that integrates with Google Sheets for menu management and order processing.

## Features

- **Menu Display**: Fetches menu items from Google Sheets with categories, descriptions, prices, and images
- **Shopping Cart**: Add/remove items, adjust quantities, view total
- **Checkout Process**: Customer information form with order summary
- **Order Submission**: Sends orders to Google Sheets for cafe management
- **Mobile Responsive**: Optimized for mobile devices
- **Category Filtering**: Filter menu items by category

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Google Sheets Setup

#### Create Menu Spreadsheet
Create a Google Sheet with the following columns:
- Column A: Item Name
- Column B: Description
- Column C: Price (numeric)
- Column D: Category
- Column E: Image URL (optional)

#### Create Order Spreadsheet
Create another Google Sheet with the following columns:
- Column A: Timestamp
- Column B: Customer Name
- Column C: Customer Phone
- Column D: Order Items (JSON)
- Column E: Total
- Column F: Notes
- Column G: Status

### 3. Google Sheets API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create credentials (API Key)
5. Make sure your sheets are publicly readable or properly shared

### 4. Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your credentials:
```env
REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
REACT_APP_MENU_SHEET_ID=your_menu_spreadsheet_id
REACT_APP_ORDER_SHEET_ID=your_order_spreadsheet_id
```

**Getting Sheet IDs**: 
From the sheet URL `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`, the `SHEET_ID` is the long string between `/d/` and `/edit`.

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

## File Structure

```
src/
├── components/
│   ├── MenuItem.js          # Individual menu item display
│   ├── MenuList.js          # Menu with category filtering
│   ├── Cart.js              # Shopping cart component
│   └── CheckoutForm.js      # Order checkout form
├── services/
│   └── googleSheets.js      # Google Sheets API integration
├── App.js                   # Main application component
└── App.css                  # Responsive styling
```

## Usage

1. **Browse Menu**: View all menu items or filter by category
2. **Add to Cart**: Click "Add to Cart" to add items
3. **View Cart**: Navigate to cart to see selected items
4. **Adjust Quantities**: Use +/- buttons or remove items
5. **Checkout**: Enter customer details and submit order
6. **Order Confirmation**: Receive confirmation and option for new order

## Google Sheets Integration

### Menu Sheet Format
```
Name          | Description           | Price | Category | Image URL
Espresso      | Strong coffee shot   | 2.50  | Coffee   | https://...
Croissant     | Buttery pastry       | 3.00  | Pastry   | https://...
```

### Order Sheet Format
Orders are automatically appended with:
- Timestamp of order
- Customer contact information
- JSON string of ordered items
- Total amount
- Special notes
- Initial status "Pending"

## Troubleshooting

- **Menu not loading**: Check API key and sheet ID, ensure sheet is publicly readable
- **Orders not submitting**: Verify write permissions and order sheet format
- **Mobile display issues**: Test responsive design on actual devices

## Security Notes

- Store API keys securely in production
- Consider implementing rate limiting
- Monitor API usage to avoid quota limits
- Validate all user inputs before submission
