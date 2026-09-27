import React from 'react';
import { X, MapPin, Check, Navigation } from 'lucide-react';
import { SwiggyAddress } from '../types/swiggy';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: SwiggyAddress[];
  selectedAddress: SwiggyAddress;
  onSelectAddress: (addr: SwiggyAddress) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  addresses,
  selectedAddress,
  onSelectAddress
}) => {
  if (!isOpen) return null;

  const handleUseCurrentGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const gpsAddr: SwiggyAddress = {
            id: 'addr_gps_' + Date.now(),
            tag: 'Other',
            addressLine: 'Current Detected Location',
            landmark: `GPS (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`,
            city: 'Bengaluru',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            pincode: '560001'
          };
          onSelectAddress(gpsAddr);
          onClose();
        },
        () => {
          alert('Could not access current location. Please choose from saved addresses.');
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111622] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-[#FC8019]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Delivery Location
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Determines available Swiggy restaurants & delivery time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Addresses */}
        <div className="p-5 space-y-3">
          <button
            type="button"
            onClick={handleUseCurrentGPS}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-left text-xs text-[#FC8019] hover:brightness-95 transition-all"
          >
            <Navigation className="w-4 h-4 shrink-0" />
            <div>
              <span className="font-bold block">Use Current GPS Location</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                Detects closest restaurants in your immediate radius
              </span>
            </div>
          </button>

          <div className="pt-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
              Saved Swiggy Addresses
            </span>
            <div className="space-y-2">
              {addresses.map((addr) => {
                const isSelected = selectedAddress.id === addr.id;
                return (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => {
                      onSelectAddress(addr);
                      onClose();
                    }}
                    className={`w-full flex items-start justify-between p-3.5 rounded-2xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-[#FC8019] bg-[#FC8019]/10 text-gray-900 dark:text-white ring-2 ring-[#FC8019]/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/40 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {addr.tag}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {addr.city}
                        </span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 leading-snug">
                        {addr.addressLine}
                      </p>
                      {addr.landmark && (
                        <p className="text-[11px] text-[#FC8019] mt-0.5">
                          Near {addr.landmark}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-[#FC8019] shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
