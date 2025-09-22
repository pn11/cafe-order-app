import React, { useState } from 'react';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import { submitOrder } from './services/googleSheets';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'cart', 'checkout', 'success'
  const [cartItems, setCartItems] = useState([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = async (orderData) => {
    try {
      await submitOrder(orderData);
      setOrderSubmitted(true);
      setCurrentView('success');
      setCartItems([]);
    } catch (error) {
      alert('Failed to submit order. Please try again.');
    }
  };

  const resetApp = () => {
    setCurrentView('menu');
    setCartItems([]);
    setOrderSubmitted(false);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Cafe Mobile Order</h1>
        <nav className="nav-buttons">
          <button 
            className={`nav-btn ${currentView === 'menu' ? 'active' : ''}`}
            onClick={() => setCurrentView('menu')}
          >
            Menu
          </button>
          <button 
            className={`nav-btn cart-btn ${currentView === 'cart' ? 'active' : ''}`}
            onClick={() => setCurrentView('cart')}
          >
            Cart {cartItemCount > 0 && <span className="cart-count">({cartItemCount})</span>}
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'menu' && (
          <MenuList onAddToCart={addToCart} />
        )}

        {currentView === 'cart' && (
          <Cart 
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={() => setCurrentView('checkout')}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutForm 
            cartItems={cartItems}
            total={getCartTotal()}
            onSubmitOrder={handleSubmitOrder}
            onCancel={() => setCurrentView('cart')}
          />
        )}

        {currentView === 'success' && (
          <div className="success-page">
            <h2>Order Submitted Successfully!</h2>
            <p>Thank you for your order. We'll contact you when it's ready.</p>
            <button className="new-order-btn" onClick={resetApp}>
              Place New Order
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
