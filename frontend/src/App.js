import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { CartProvider } from './contexts/CartContext';
import './App.css';

// Lazy load components
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const ShopDashboard = lazy(() => import('./pages/ShopDashboard'));
const ShopPage = lazy(() => import('./pages/shop_1'));
const Login = lazy(() => import('./pages/Login'));
const UserRegister = lazy(() => import('./pages/UserRegister'));
const ShopRegister = lazy(() => import('./pages/ShopRegister'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ShopsList = lazy(() => import('./pages/ShopsList'));
const NurseryDetails = lazy(() => import('./pages/NurseryDetails'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Cart = lazy(() => import('./pages/Cart'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const LoadingSpinner = () => (
    <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
    </div>
);

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div className="error-container">
            <h2>Something went wrong:</h2>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary} className="retry-button">
                Try again
            </button>
        </div>
    );
};

// Layout Component
const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <main className="main-content">
                <Suspense fallback={<LoadingSpinner />}>
                    {children}
                </Suspense>
            </main>
        </div>
    );
};

// Protected Route Component
const ProtectedRoute = ({ children, userType }) => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');

    if (!token || storedUserType !== userType) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                window.location.reload();
            }}
        >
            <CartProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={
                                <ProtectedRoute userType="user">
                                    <UserDashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/user-dashboard" element={
                                <ProtectedRoute userType="user">
                                    <UserDashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/shop-dashboard" element={
                                <ProtectedRoute userType="shop">
                                    <ShopDashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/nursery/:id" element={
                                <ProtectedRoute userType="user">
                                    <NurseryDetails />
                                </ProtectedRoute>
                            } />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register/user" element={<UserRegister />} />
                            <Route path="/register/shop" element={<ShopRegister />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/shops" element={
                                <ProtectedRoute userType="user">
                                    <ShopsList />
                                </ProtectedRoute>
                            } />

                            <Route path="/checkout" element={
                                <ProtectedRoute userType="user">
                                    <Checkout />
                                </ProtectedRoute>
                            } />
                            <Route path="/cart" element={
                                <ProtectedRoute userType="user">
                                    <Cart />
                                </ProtectedRoute>
                            } />
                            <Route path="/orders" element={
                                <ProtectedRoute userType="user">
                                    <Orders />
                                </ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                                <ProtectedRoute userType="user">
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Layout>
                </Router>
            </CartProvider>
        </ErrorBoundary>
    );
}

export default App;
