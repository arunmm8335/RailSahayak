
import React, { useState } from 'react';
import { RESTAURANTS, TRANSLATIONS } from '../constants';
import { FoodItem } from '../types';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FoodDeliveryProps {
    language: 'EN' | 'HI';
}

interface OrderReceipt {
    orderId: string;
    items: FoodItem[];
    total: number;
    gst: number;
    finalTotal: number;
    station: string;
    coach: string;
    timestamp: Date;
}

const FoodDelivery: React.FC<FoodDeliveryProps> = ({ language }) => {
  const [cart, setCart] = useState<FoodItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showReceipt, setShowReceipt] = useState<OrderReceipt | null>(null);
  
  // Simulation: Train stop is 10 mins away, stops for 5 mins.
  const timeToArrival = 10; 
  const haltDuration = 5;

  const t = TRANSLATIONS[language].food;

  const addToCart = (item: FoodItem) => {
    if (item.prepTimeMinutes > timeToArrival + haltDuration) {
        alert("⚠️ Cannot order! Kitchen prep time exceeds train halt window.");
        return;
    }
    setCart([...cart, item]);
  };

  const removeFromCart = (indexToRemove: number) => {
      setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const placeOrder = async () => {
      setOrderPlaced(true);

      const subTotal = cart.reduce((sum, item) => sum + item.price, 0);
      const gst = Math.round(subTotal * 0.05); // 5% GST
      const finalTotal = subTotal + gst;
      const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
      
      const orderData: OrderReceipt = {
          orderId,
          items: [...cart],
          total: subTotal,
          gst,
          finalTotal,
          station: 'Kota Jn (KOTA)',
          coach: 'B5 / Seat 32',
          timestamp: new Date()
      };

      try {
          if (db) {
              await addDoc(collection(db, 'orders'), {
                  ...orderData,
                  userId: 'user-id-placeholder', // In a real app, pass user.id props
                  status: 'CONFIRMED',
                  createdAt: serverTimestamp()
              });
          }
      } catch (e) {
          console.error("Error saving order to DB:", e);
      }

      // Simulate network delay then show receipt
      setTimeout(() => {
          setReceiptAndClear(orderData);
      }, 2000);
  };

  const setReceiptAndClear = (receipt: OrderReceipt) => {
      setOrderPlaced(false);
      setCart([]);
      setShowReceipt(receipt);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const CartContent = () => (
      <>
        <div className="space-y-4">
            {cart.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    <span className="text-4xl block mb-2 grayscale dark:invert">🍽️</span>
                    <p>Your cart is empty</p>
                </div>
            ) : (
                cart.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex justify-between items-center group">
                        <div className="text-sm">
                            <p className="font-medium text-gray-800 dark:text-slate-200">{item.name}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">₹{item.price}</p>
                        </div>
                        <button 
                            onClick={() => removeFromCart(idx)}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded transition opacity-0 group-hover:opacity-100">
                            ✕
                        </button>
                    </div>
                ))
            )}
        </div>

        {cart.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-4">
                <div className="flex justify-between font-bold text-gray-900 dark:text-white text-lg">
                    <span>{t.total}</span>
                    <span>₹{total}</span>
                </div>
                <button 
                    onClick={placeOrder}
                    disabled={orderPlaced}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2 transition-transform active:scale-95 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:shadow-none">
                    {orderPlaced ? (
                        <>
                            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                            Processing...
                        </>
                    ) : (
                        t.checkout
                    )}
                </button>
                <p className="text-xs text-center text-gray-400 dark:text-slate-500">
                    Order accepted only if train is {timeToArrival} mins away.
                </p>
            </div>
        )}
      </>
  );

  return (
    <div className="h-full flex flex-col md:flex-row bg-gray-50 dark:bg-slate-950 md:rounded-xl md:overflow-hidden relative transition-colors duration-300">
      
      {/* LEFT PANE: Menu & Header */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-4 shadow-sm z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t.title}</h2>
                <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">{t.subtitle}</p>
            </div>
            <div className="flex gap-2 text-xs w-full sm:w-auto">
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-900 flex-1 sm:flex-none text-center">
                    Arr: <strong>{timeToArrival}m</strong>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1.5 rounded-lg border border-orange-200 dark:border-orange-900 flex-1 sm:flex-none text-center">
                    Halt: <strong>{haltDuration}m</strong>
                </div>
            </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 md:pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {RESTAURANTS.map((item) => {
                    const isRisky = item.prepTimeMinutes > timeToArrival;
                    return (
                        <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm flex gap-4 border border-gray-100 dark:border-slate-800 hover:shadow-md transition group">
                            <div className="relative">
                                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover bg-gray-200 dark:bg-slate-800 shrink-0" />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 text-center rounded-b-lg backdrop-blur-sm">
                                    {item.prepTimeMinutes}m {t.prep}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-800 dark:text-slate-100 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{item.name}</h3>
                                        <span className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-[10px] px-1.5 py-0.5 rounded border border-yellow-200 dark:border-yellow-900">★ {item.rating}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{item.restaurant}</p>
                                </div>
                                
                                <div className="flex items-center justify-between mt-3 gap-3">
                                    <p className="font-semibold text-gray-900 dark:text-slate-200 whitespace-nowrap">₹{item.price}</p>
                                    <button 
                                        onClick={() => addToCart(item)}
                                        className={`text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition active:scale-95 whitespace-nowrap ${
                                            isRisky 
                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/40' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}>
                                        {isRisky ? '⚠️ High Risk' : 'ADD +'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* MOBILE ONLY: Bottom Cart Bar */}
        {cart.length > 0 && (
            <div className="md:hidden absolute bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <span className="text-xs font-medium text-gray-500 dark:text-slate-400 block">{cart.length} Items</span>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">₹{total}</span>
                    </div>
                    <button 
                        onClick={placeOrder}
                        disabled={orderPlaced}
                        className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg">
                        {orderPlaced ? '...' : t.checkout}
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* RIGHT PANE: Desktop Sidebar Cart */}
      <div className="hidden md:flex w-80 lg:w-96 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 flex-col h-full shadow-xl z-20 shrink-0 transition-colors duration-300">
          <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                  <span>🛒</span> Current Order
              </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
              <CartContent />
          </div>
      </div>

      {/* RECEIPT MODAL */}
      {showReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-slate-700">
                  {/* Receipt Header */}
                  <div className="bg-green-600 text-white p-6 text-center relative overflow-hidden">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h2 className="text-2xl font-bold">Order Successful!</h2>
                      <p className="text-green-100 text-sm">Your food is being prepared.</p>
                      
                      {/* Ticket Cutout Effect */}
                      <div className="absolute -bottom-2 left-0 w-full h-4 flex justify-between">
                          {[...Array(20)].map((_, i) => (
                              <div key={i} className="w-4 h-4 bg-white dark:bg-slate-900 rounded-full -mb-2"></div>
                          ))}
                      </div>
                  </div>

                  <div className="p-6 pt-8 space-y-6">
                      {/* Order Info */}
                      <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-slate-800 pb-4">
                          <div>
                              <p className="text-gray-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">Order ID</p>
                              <p className="font-mono font-bold text-gray-800 dark:text-slate-200 text-lg">#{showReceipt.orderId}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-gray-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">Date</p>
                              <p className="font-medium text-gray-800 dark:text-slate-200">{showReceipt.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                          </div>
                      </div>

                      {/* Item Summary */}
                      <div className="space-y-3">
                          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Order Summary</p>
                          {showReceipt.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-700 dark:text-slate-300">1 x {item.name}</span>
                                  <span className="font-medium text-gray-900 dark:text-white">₹{item.price}</span>
                              </div>
                          ))}
                          <div className="pt-3 border-t border-dashed border-gray-200 dark:border-slate-700">
                              <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-500 dark:text-slate-400">Subtotal</span>
                                  <span className="text-gray-700 dark:text-slate-300">₹{showReceipt.total}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-500 dark:text-slate-400">GST (5%)</span>
                                  <span className="text-gray-700 dark:text-slate-300">₹{showReceipt.gst}</span>
                              </div>
                              <div className="flex justify-between text-lg font-bold mt-2 text-blue-600 dark:text-blue-400">
                                  <span>Total Paid</span>
                                  <span>₹{showReceipt.finalTotal}</span>
                              </div>
                          </div>
                      </div>

                      {/* Delivery Location */}
                      <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                           <div className="flex items-start gap-3">
                               <div className="mt-1 text-xl">📍</div>
                               <div>
                                   <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Delivering To</p>
                                   <p className="font-bold text-gray-800 dark:text-slate-200 text-sm">{showReceipt.station}</p>
                                   <p className="text-sm text-gray-600 dark:text-slate-400">{showReceipt.coach}</p>
                               </div>
                           </div>
                      </div>

                      <button 
                        onClick={() => setShowReceipt(null)}
                        className="w-full bg-gray-900 dark:bg-slate-700 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-black dark:hover:bg-slate-600 transition-colors">
                        Done
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default FoodDelivery;
