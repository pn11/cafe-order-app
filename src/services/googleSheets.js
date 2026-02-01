const API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
const MENU_SHEET_ID = process.env.REACT_APP_MENU_SHEET_ID;
const ORDER_SHEET_ID = process.env.REACT_APP_ORDER_SHEET_ID;
const APPS_SCRIPT_URL = process.env.REACT_APP_APPS_SCRIPT_URL;

export const fetchMenuData = async () => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${MENU_SHEET_ID}/values/Sheet1?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch menu data');
    }
    
    const data = await response.json();
    const rows = data.values;
    
    if (!rows || rows.length === 0) {
      return [];
    }
    
    // Skip header row and convert to menu items
    const menuItems = rows.slice(1).map((row, index) => ({
      id: index + 1,
      name: row[0] || '',
      description: row[1] || '',
      price: parseFloat(row[2]) || 0,
      category: row[3] || 'Other',
      image: row[4] || ''
    }));
    
    return menuItems;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return [];
  }
};

export const submitOrder = async (orderData, apiKey) => {
  if (!APPS_SCRIPT_URL) {
    throw new Error('Apps Script URL not configured. Please set REACT_APP_APPS_SCRIPT_URL in your .env file');
  }

  let response;
  try {
    response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ ...orderData, apiKey }),
      redirect: 'follow'
    });
  } catch (error) {
    throw new Error('Network error. Please check your connection.');
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error('Server returned an invalid response. Please try again.');
  }

  if (!data.success) {
    throw new Error(data.message || 'Order submission failed');
  }

  return data;
};