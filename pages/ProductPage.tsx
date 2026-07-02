import React, { useState, useMemo } from 'react';
import type { Product, User, CartItem, PaymentMethod } from '../types';
import ProductCard from '../components/ProductCard';
import AddProductForm from '../components/AddProductForm';
import CartSidebar from '../components/CartSidebar';
import EditProductModal from '../components/EditProductModal';

type ProductPageMode = 'my-produce' | 'farmers-market' | 'buyer';

interface ProductPageProps {
  user: User;
  products: Product[];
  cart: CartItem[];
  mode: ProductPageMode;
  onAddProduct: (product: Omit<Product, 'id' | 'farmer' | 'reviews'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateCart: (productId: string, newQuantity: number) => void;
  onCheckout: (paymentMethod: PaymentMethod) => void;
}

const ProductPage: React.FC<ProductPageProps> = (props) => {
  const { user, products, cart, mode, onAddProduct, onUpdateProduct, onDeleteProduct, onAddToCart, onUpdateCart, onCheckout } = props;
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pageConfig = useMemo(() => {
    switch (mode) {
      case 'my-produce':
        return {
          title: 'My Farm Produce',
          showCart: false,
          allowAdding: true,
          sections: [{ title: 'My Produce Listings', items: products.filter(p => p.farmer === user.uid && p.category === 'produce') }]
        };
      case 'farmers-market':
        const supplies = products.filter(p => p.farmer !== user.uid && p.category === 'supplies' && p.type === 'sale');
        const machinery = products.filter(p => p.category === 'machinery' && p.type === 'rental' && p.location?.city === user.location?.city);
        return {
          title: "Farmers' Marketplace",
          showCart: true,
          allowAdding: false,
          sections: [
            { title: `Supplies for Sale (In ${user.location?.city})`, items: supplies },
            { title: `Machinery For Rent (In ${user.location?.city})`, items: machinery },
          ]
        };
      case 'buyer':
        return {
          title: 'Marketplace',
          showCart: true,
          allowAdding: false,
          sections: [{ title: 'Fresh Produce For Sale', items: products.filter(p => p.type === 'sale' && p.category === 'produce') }]
        };
    }
  }, [mode, products, user]);

  const handleAddProductWithFeedback = (product: Omit<Product, 'id' | 'farmer' | 'reviews'>) => {
    onAddProduct(product);
    setShowAddForm(false);
    setSuccessMessage(`✓ "${product.name}" has been added successfully!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleEditProduct = (product: Product) => {
      onUpdateProduct(product);
      setEditingProduct(null);
  }
  
  const ProductSection: React.FC<{title: string, items: Product[]}> = ({title, items}) => (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">{title}</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              userRole={user.role}
              onAddToCart={onAddToCart}
              onEdit={() => setEditingProduct(product)}
              onDelete={onDeleteProduct}
              isMyProductPage={mode === 'my-produce'}
            />
          ))}
        </div>
      ) : <p className="text-gray-500">No products found in this category.</p>}
    </section>
  );

  return (
    <div className="flex-grow flex flex-col md:flex-row w-full overflow-hidden">
      <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-3 sm:mb-0">{pageConfig.title}</h1>
            {pageConfig.allowAdding && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
              >
                {showAddForm ? 'Cancel' : '＋ Add New Product'}
              </button>
            )}
            {/* Allow farmers to add products directly from Farmers' Marketplace view */}
            {mode === 'farmers-market' && user.role === 'farmer' && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="ml-3 px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700"
              >
                {showAddForm ? 'Close Add Form' : '＋ Add Listing (Farmers)'}
              </button>
            )}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg animate-pulse">
              {successMessage}
            </div>
          )}
          
          {showAddForm && (pageConfig.allowAdding || (mode === 'farmers-market' && user.role === 'farmer')) && (
            <div className="mb-6">
              <AddProductForm onSubmit={handleAddProductWithFeedback} />
            </div>
          )}

          {pageConfig.sections.map(section => (
              <ProductSection key={section.title} title={section.title} items={section.items} />
          ))}
          
        </div>
      </main>
      
      {pageConfig.showCart && (
        <div className={user.role === 'buyer' ? 'hidden md:flex' : 'flex'}>
            <CartSidebar 
              cart={cart}
              products={products}
              onUpdateCart={onUpdateCart}
              onCheckout={onCheckout}
            />
        </div>
      )}
      
      {editingProduct && (
          <EditProductModal
            product={editingProduct}
            onSave={handleEditProduct}
            onClose={() => setEditingProduct(null)}
          />
      )}
    </div>
  );
};

export default ProductPage;
