
import React, { useState } from 'react';
import { ServiceBooking } from '../types';
import { TRANSLATIONS } from '../constants';

interface ServicesProps {
    language: 'EN' | 'HI';
}

const Services: React.FC<ServicesProps> = ({ language }) => {
  const [activeService, setActiveService] = useState<'COOLIE' | 'WHEELCHAIR' | 'CLOAK' | 'MEDICAL'>('COOLIE');
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [luggageWeight, setLuggageWeight] = useState(20);
  const [findingDoctor, setFindingDoctor] = useState(false);
  const [doctorFound, setDoctorFound] = useState<string | null>(null);

  const t = TRANSLATIONS[language].services;

  const handleBook = () => {
    const newBooking: ServiceBooking = {
        id: Math.random().toString(36).substr(2, 9),
        type: activeService as any,
        status: 'PENDING',
        details: activeService === 'COOLIE' ? `${luggageWeight}kg Luggage` : activeService === 'MEDICAL' ? 'Doctor Request' : 'Assistance Required',
        price: activeService === 'COOLIE' ? Math.floor(luggageWeight * 2.5) : 0
    };
    setBookings([newBooking, ...bookings]);
  };

  const handleFindDoctor = () => {
      setFindingDoctor(true);
      setDoctorFound(null);
      // Simulate scanning passenger manifest
      setTimeout(() => {
          setFindingDoctor(false);
          setDoctorFound("Dr. Anjali Verma (MD) - Coach B2, Seat 45");
      }, 3000);
  };

  return (
    <div className="p-4 md:p-0 space-y-6 h-full flex flex-col">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.title}</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">{t.subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1">
        {/* Left Column: Form */}
        <div className="flex-1 space-y-6">
            {/* Service Selector */}
            <div className="flex p-1 bg-gray-200 dark:bg-slate-800 rounded-lg overflow-x-auto">
                <button 
                    onClick={() => setActiveService('COOLIE')}
                    className={`flex-1 min-w-[80px] py-2 text-sm font-medium rounded-md transition-all ${activeService === 'COOLIE' ? 'bg-white dark:bg-slate-600 text-blue-700 dark:text-blue-100 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}>
                    {t.coolie}
                </button>
                <button 
                    onClick={() => setActiveService('WHEELCHAIR')}
                    className={`flex-1 min-w-[80px] py-2 text-sm font-medium rounded-md transition-all ${activeService === 'WHEELCHAIR' ? 'bg-white dark:bg-slate-600 text-blue-700 dark:text-blue-100 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}>
                    {t.wheelchair}
                </button>
                <button 
                    onClick={() => setActiveService('CLOAK')}
                    className={`flex-1 min-w-[80px] py-2 text-sm font-medium rounded-md transition-all ${activeService === 'CLOAK' ? 'bg-white dark:bg-slate-600 text-blue-700 dark:text-blue-100 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}>
                    {t.cloak}
                </button>
                <button 
                    onClick={() => setActiveService('MEDICAL')}
                    className={`flex-1 min-w-[80px] py-2 text-sm font-medium rounded-md transition-all ${activeService === 'MEDICAL' ? 'bg-red-600 text-white shadow-sm' : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}>
                    RailMed ✚
                </button>
            </div>

            {/* Booking Form Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 min-h-[300px] flex flex-col justify-between transition-colors duration-300">
                {activeService === 'COOLIE' && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <span className="text-6xl grayscale dark:invert">🧳</span>
                            <h3 className="text-lg font-bold mt-2 text-gray-900 dark:text-white">Book a Sahayak</h3>
                            <p className="text-xs text-gray-400 dark:text-slate-500">Uniformed • Verified • Fixed Rate</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">Luggage Weight (Approx)</label>
                            <input 
                                type="range" 
                                min="5" 
                                max="80" 
                                value={luggageWeight} 
                                onChange={(e) => setLuggageWeight(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between mt-2">
                                <span className="text-sm font-bold text-gray-900 dark:text-slate-100">{luggageWeight} kg</span>
                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">₹{Math.floor(luggageWeight * 2.5)}</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-900/30">
                            <p><strong>Note:</strong> Porter will meet you at Coach A1 upon arrival.</p>
                        </div>
                    </div>
                )}

                {activeService === 'WHEELCHAIR' && (
                    <div className="space-y-6 text-center">
                        <span className="text-6xl grayscale dark:invert">♿</span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Request Mobility Assistance</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Free service for senior citizens and PwD.</p>
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-xs text-green-800 dark:text-green-200 text-left border border-green-100 dark:border-green-900/30">
                            <p>✓ Electric Cart Available at Platform 1</p>
                            <p>✓ Manual Wheelchair Available at all platforms</p>
                        </div>
                    </div>
                )}

                {activeService === 'CLOAK' && (
                    <div className="space-y-6 text-center">
                        <span className="text-6xl grayscale dark:invert">🔐</span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Check Locker Availability</h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                <div className="text-2xl font-bold text-green-700 dark:text-green-400">12</div>
                                <div className="text-xs text-green-800 dark:text-green-300">Large Lockers</div>
                            </div>
                            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                                <div className="text-2xl font-bold text-red-700 dark:text-red-400">0</div>
                                <div className="text-xs text-red-800 dark:text-red-300">Small Lockers</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeService === 'MEDICAL' && (
                    <div className="space-y-6 text-center">
                        <div className="relative inline-block">
                             <span className="text-6xl animate-pulse block">🏥</span>
                             {findingDoctor && (
                                 <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
                             )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">RailMed: Doctor on Board</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Locate verified doctors travelling on this train.</p>
                        
                        {doctorFound ? (
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 animate-in fade-in zoom-in duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow">👨‍⚕️</div>
                                    <div className="text-left">
                                        <p className="font-bold text-green-800 dark:text-green-200 text-sm">Doctor Found!</p>
                                        <p className="text-xs text-green-700 dark:text-green-300 font-medium">{doctorFound}</p>
                                    </div>
                                </div>
                                <button className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg text-xs font-bold shadow-sm">
                                    Request Help
                                </button>
                            </div>
                        ) : (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg text-xs text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-900/30">
                                <p><strong>How it works:</strong> We scan the passenger chart for registered medical practitioners.</p>
                            </div>
                        )}
                    </div>
                )}

                <button 
                    onClick={activeService === 'MEDICAL' ? handleFindDoctor : handleBook}
                    disabled={activeService === 'MEDICAL' && findingDoctor}
                    className={`w-full mt-6 text-white py-3 rounded-lg font-semibold shadow-lg transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${
                        activeService === 'MEDICAL' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500'
                    }`}>
                    {activeService === 'CLOAK' ? 'Reserve Locker' : 
                     activeService === 'MEDICAL' ? (findingDoctor ? 'Scanning Manifest...' : (doctorFound ? 'Find Another Doctor' : 'Scan for Doctors')) : 
                     'Confirm Request'}
                </button>
            </div>
        </div>

        {/* Right Column: Bookings (Sticky on desktop) */}
        <div className="flex-1">
             <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 h-full transition-colors duration-300">
                <h3 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-4">Your Active Requests</h3>
                {bookings.length > 0 ? (
                    <div className="space-y-3">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border-l-4 border-yellow-400 shadow-sm flex justify-between items-center group hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition">
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-slate-200">{booking.type === 'COOLIE' ? 'Porter Request' : booking.type}</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">{booking.details} • ID: #{booking.id}</p>
                                </div>
                                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs px-2 py-1 rounded font-medium border border-yellow-200 dark:border-yellow-800">
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-slate-600">
                        <span className="text-4xl mb-2 opacity-30 grayscale dark:invert">📋</span>
                        <p className="text-sm">No active bookings yet.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
