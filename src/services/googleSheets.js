const API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
const MENU_SHEET_ID = process.env.REACT_APP_MENU_SHEET_ID;
const ORDER_SHEET_ID = process.env.REACT_APP_ORDER_SHEET_ID;

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

export const submitOrder = async (orderData) => {
  try {
    const timestamp = new Date().toISOString();
    const orderRow = [
      timestamp,
      orderData.customerName || '',
      orderData.customerPhone || '',
      JSON.stringify(orderData.items),
      orderData.total,
      orderData.notes || '',
      'Pending'
    ];
    
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${ORDER_SHEET_ID}/values/Sheet1:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [orderRow]
        })
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to submit order');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting order:', error);
    throw error;
  }
};