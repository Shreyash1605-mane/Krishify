import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { onSnapshot, doc, getDoc, setDoc, addDoc, getDocs, collection, query, where, writeBatch, updateDoc, deleteDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from './firebase/config';

import type { Page, User, Product, CartItem, Order, OrderStatus, PaymentMethod, Review } from './types';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ChatPage from './pages/ChatPage';
import ProductPage from './pages/ProductPage';
import OrdersPage from './pages/OrdersPage';
import DashboardPage from './pages/DashboardPage';
import SchemesPage from './pages/SchemesPage';
import ExpertsPage from './pages/ExpertsPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import TwoFactorAuthModal from './components/TwoFactorAuthModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import FirebaseConfigErrorModal from './components/FirebaseConfigErrorModal';
import { OrderStatus as OrderStatusEnum } from './types';
import Spinner from './components/Spinner';
import FirestoreErrorModal from './components/FirestoreErrorModal'; // Import the new modal

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [userPending2FA, setUserPending2FA] = useState<User | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showConfigErrorModal, setShowConfigErrorModal] = useState(false);
  const [firestoreError, setFirestoreError] = useState<string | null>(null); // New state for Firestore errors
  const [currentPage, setCurrentPage] = useState<Page>('login');
  
  const [cart, setCart] = useState<CartItem[]>([]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setCurrentUser({ uid: user.uid, ...userDoc.data() } as User);
        } else {
          // Handle case where user exists in Auth but not Firestore
          signOut(auth);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  // Real-time data fetching listener
  useEffect(() => {
    if (!currentUser) {
      setProducts([]);
      setOrders([]);
      return;
    }

    // Listener for products
    const productsUnsubscribe = onSnapshot(query(collection(db, "products")), 
      (snapshot) => {
        setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        setFirestoreError(null); // Clear error on success
      }, 
      (error) => {
        console.error("Firestore Products Error:", { code: error.code, message: error.message });
        setFirestoreError("Could not connect to the database to fetch products. Please check your setup in the Firebase Console.");
      }
    );

    // Listener for orders based on user role
    const ordersQuery = currentUser.role === 'farmer'
      ? query(collection(db, "orders"), where("farmerId", "==", currentUser.uid))
      : query(collection(db, "orders"), where("buyerId", "==", currentUser.uid));
      
    const ordersUnsubscribe = onSnapshot(ordersQuery, 
      (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
        setFirestoreError(null); // Clear error on success
      }, 
      (error) => {
        console.error("Firestore Orders Error:", { code: error.code, message: error.message });
        setFirestoreError("Could not connect to the database to fetch orders. Please check your setup in the Firebase Console.");
      }
    );

    // Cleanup listeners on component unmount or user change
    return () => {
      productsUnsubscribe();
      ordersUnsubscribe();
    };
  }, [currentUser]);


  useEffect(() => {
    if (currentUser) {
      setCurrentPage(currentUser.role === 'farmer' ? 'dashboard' : 'products');
    } else {
      setCurrentPage('login');
      setCart([]);
    }
  }, [currentUser]);

  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        setUserPending2FA({ uid: userCredential.user.uid, ...userDoc.data() } as User); // Start 2FA process
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Login Error:", { code: error.code, message: error.message });
      return false;
    }
  };

  const handle2FAVerification = (code: string) => {
    if (userPending2FA && code === '123456') {
      setCurrentUser(userPending2FA); // This is already handled by onAuthStateChanged, but we set it for immediate UI update
      setUserPending2FA(null);
    } else {
      alert("Invalid verification code.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUserPending2FA(null);
  };
  
  const handleForgotPassword = (email: string): void => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent! Please check your inbox.");
        setIsForgotPasswordOpen(false);
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  };

  const handleRegister = async (newUser: Omit<User, 'uid' | 'id'>, pass: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, pass);
      const { uid } = userCredential.user;
      
      let finalUser: Omit<User, 'uid' | 'password'>;
      let customId: string;
      if (newUser.role === 'farmer') {
        const randomId = Math.floor(1000 + Math.random() * 9000);
        customId = `FARM-${randomId}`;
      } else {
        customId = newUser.contact;
      }
      finalUser = { ...newUser, id: customId };
      
      await setDoc(doc(db, 'users', uid), finalUser);
      setUserPending2FA({ ...finalUser, uid } as User);
    } catch (error: any) {
      console.error("Registration error:", { code: error.code, message: error.message });
      if (error.code === 'auth/email-already-in-use') {
        alert('This email address is already registered. Please try logging in instead.');
      } else if (error.code === 'auth/configuration-not-found') {
        setShowConfigErrorModal(true);
      } else {
        alert(`Registration failed: ${error.message}`);
      }
    }
  };
  
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  // Product Management (CRUD)
  const handleAddProduct = async (newProductData: Omit<Product, 'id' | 'farmer' | 'reviews'>) => {
    if (!currentUser || currentUser.role !== 'farmer') return;
    const newProduct = {
      ...newProductData,
      farmer: currentUser.uid,
      farmerName: currentUser.name,
      reviews: [],
      location: currentUser.location,
      category: 'produce' as 'produce',
    };
    const docRef = await addDoc(collection(db, 'products'), newProduct);
    setProducts(prev => [...prev, { ...newProduct, id: docRef.id }]);
  };
  
  const handleUpdateProduct = async (updatedProduct: Product) => {
    const productRef = doc(db, 'products', updatedProduct.id);
    const { id, ...dataToUpdate } = updatedProduct;
    await updateDoc(productRef, dataToUpdate);
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  const handleDeleteProduct = async (productId: string) => {
    await deleteDoc(doc(db, 'products', productId));
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Cart Management
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity }];
      }
    });
  };

  const handleUpdateCart = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
        setCart(prev => prev.filter(item => item.productId !== productId));
    } else {
        setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity: newQuantity } : item));
    }
  };

  const handleCheckout = async (paymentMethod: PaymentMethod) => {
    if (!currentUser || cart.length === 0) return;

    const batch = writeBatch(db);
    
    const newOrderDocs: Omit<Order, 'id'>[] = [];

    for (const item of cart) {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error("Product not found");

        const initialStatus = OrderStatusEnum.PLACED;
        const newOrder: Omit<Order, 'id'> = {
            productId: item.productId,
            buyerId: currentUser.uid,
            buyerName: currentUser.name,
            farmerId: product.farmer, // farmer's uid
            farmer: product.farmerName,
            productName: item.name,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity,
            orderDate: new Date().toISOString(),
            status: initialStatus,
            trackingHistory: [{ status: initialStatus, date: new Date().toISOString(), location: 'Order placed' }],
            paymentMethod: paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'Unpaid' : 'Paid',
        };

        const orderRef = doc(collection(db, 'orders'));
        batch.set(orderRef, newOrder);
        newOrderDocs.push(newOrder);

        const productRef = doc(db, 'products', item.productId);
        batch.update(productRef, { stock: product.stock - item.quantity });
    }

    await batch.commit();

    setOrders(prev => [...prev, ...newOrderDocs.map((o, i) => ({ ...o, id: `temp-id-${i}` }))]); // Optimistic update
    setCart([]);
    alert(`Checkout successful using ${paymentMethod}! Your order has been placed.`);
    setCurrentPage('orders');
  };
  
  // Order Management
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;
    
    const updatedHistory = [...orderToUpdate.trackingHistory, { status, date: new Date().toISOString(), location: 'Status Updated' }];
    await updateDoc(orderRef, { status, trackingHistory: updatedHistory });
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status, trackingHistory: updatedHistory } : order));
  };

  const handleAddReview = async (productId: string, review: Omit<Review, 'buyerName' | 'date'>) => {
      if (!currentUser) return;
      const newReview: Review = {
          ...review,
          buyerName: currentUser.name,
          date: new Date().toISOString(),
      };
      
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        reviews: arrayUnion(newReview)
      });

      setProducts(prev => prev.map(p => p.id === productId ? { ...p, reviews: [...p.reviews, newReview] } : p));
  };
  
  if (authLoading) {
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <Spinner /> <span className="ml-4 text-lg">Loading Krishify...</span>
        </div>
    );
  }

  const renderPage = () => {
    if (!currentUser) {
      switch (currentPage) {
        case 'register': return <RegistrationPage onRegister={handleRegister} onNavigate={handleNavigate} />;
        case 'login': default: return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} onForgotPassword={() => setIsForgotPasswordOpen(true)} />;
      }
    }
    
    const commonProductPageProps = {
      user: currentUser,
      products: products,
      cart: cart,
      onAddProduct: handleAddProduct,
      onUpdateProduct: handleUpdateProduct,
      onDeleteProduct: handleDeleteProduct,
      onAddToCart: handleAddToCart,
      onUpdateCart: handleUpdateCart,
      onCheckout: handleCheckout,
    };
    
    const commonCartProps = {
        cart: cart,
        products: products,
        onUpdateCart: handleUpdateCart,
        onCheckout: handleCheckout,
    };

    switch (currentPage) {
      case 'chat': return <ChatPage />;
      case 'schemes': return <SchemesPage />;
      case 'experts': return <ExpertsPage />;
      case 'profile': return <ProfilePage user={currentUser} />;
      case 'cart': return <CartPage {...commonCartProps} />;
      case 'myProduce':
        return <ProductPage {...commonProductPageProps} mode="my-produce" />;
      case 'farmersMarket':
        return <ProductPage {...commonProductPageProps} mode="farmers-market" />;
      case 'products':
        return <ProductPage {...commonProductPageProps} mode="buyer" />;
      case 'orders':
        return <OrdersPage 
          user={currentUser} 
          orders={orders} 
          onUpdateStatus={handleUpdateOrderStatus}
          onAddReview={handleAddReview}
        />;
      case 'dashboard': default:
        return <DashboardPage user={currentUser} products={products.filter(p => p.farmer === currentUser.uid)} />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50">
      {userPending2FA && (
        <TwoFactorAuthModal 
          onVerify={handle2FAVerification}
          onClose={() => setUserPending2FA(null)}
        />
      )}
      {isForgotPasswordOpen && (
        <ForgotPasswordModal
            onClose={() => setIsForgotPasswordOpen(false)}
            onReset={handleForgotPassword}
        />
      )}
      {showConfigErrorModal && (
        <FirebaseConfigErrorModal onClose={() => setShowConfigErrorModal(false)} />
      )}
      {firestoreError && (
        <FirestoreErrorModal 
            message={firestoreError} 
            onClose={() => setFirestoreError(null)} 
        />
      )}
      <Header 
        user={currentUser} 
        activePage={currentPage} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
        cartItemCount={cart.length}
      />
      <main className="flex-grow flex overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;