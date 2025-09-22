import React, { useState } from 'react';
import type { Page, User } from '../types';
import KrishifyLogoIcon from './icons/FarmLogoIcon';
import CartIcon from './icons/CartIcon';

interface HeaderProps {
  user: User | null;
  activePage: Page;
  cartItemCount: number;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, activePage, cartItemCount, onLogout, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  if (!user) return null;

  const navItems = user.role === 'farmer' 
    ? ['dashboard', 'myProduce', 'farmersMarket', 'orders', 'chat', 'schemes', 'experts', 'profile'] 
    : ['products', 'orders', 'cart'];
    
  const pageTitles: Record<string, string> = {
      dashboard: 'Dashboard',
      products: 'Marketplace',
      myProduce: 'My Produce',
      farmersMarket: "Farmers' Market",
      orders: 'Orders',
      chat: 'AI Advisor',
      schemes: 'Govt. Schemes',
      experts: 'Experts',
      profile: 'Profile',
      cart: 'Cart',
  };

  const NavLink: React.FC<{ page: string }> = ({ page }) => (
     <button
        onClick={() => { onNavigate(page as Page); setIsMobileMenuOpen(false); }}
        className={`relative block md:inline-flex items-center px-3 py-2 md:px-1 md:pt-1 rounded-md md:border-b-2 text-sm font-medium ${
          activePage === page 
            ? 'bg-green-100 md:bg-transparent border-green-500 text-green-700 md:text-gray-900' 
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-100 md:hover:bg-transparent'
        }`}
      >
        {page === 'cart' && user.role === 'buyer' ? <CartIcon /> : pageTitles[page]}
        {page === 'cart' && user.role === 'buyer' && cartItemCount > 0 && (
             <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                {cartItemCount}
            </span>
        )}
         {page === 'cart' && user.role === 'buyer' && <span className="md:hidden ml-2">{pageTitles[page]}</span>}
      </button>
  );

  return (
    <header className="bg-white shadow-md w-full shrink-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 text-green-600">
            <KrishifyLogoIcon />
            <span className="font-bold text-xl">Krishify</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex md:space-x-8">
            {navItems.map(page => <NavLink key={page} page={page} />)}
          </nav>

          <div className="flex items-center">
             <div className="hidden md:flex items-center">
                <span className="text-sm text-gray-600 mr-4">Welcome, {user.name}</span>
                <button
                onClick={onLogout}
                className="px-3 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-300"
                >
                Logout
                </button>
             </div>
             {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navItems.map(page => <NavLink key={page} page={page} />)}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
             <div className="flex items-center px-5">
                <div className="ml-3">
                   <div className="text-base font-medium text-gray-800">{user.name}</div>
                </div>
             </div>
             <div className="mt-3 px-2 space-y-1">
                <button
                   onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                   className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                   >
                Logout
                </button>
             </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;