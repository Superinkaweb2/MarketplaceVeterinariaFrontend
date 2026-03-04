import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types/marketplace';

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number | string) => void;
    updateQuantity: (productId: number | string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('vetsaas_cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Error loading cart from localStorage", e);
            }
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('vetsaas_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === product.id);
            if (existingItem) {
                return currentItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentItems, { ...product, quantity: 1 }];
        });
        setIsOpen(true); // Open cart sidebar when item is added
    };

    const removeFromCart = (productId: number | string) => {
        setItems(items => items.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number | string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems(items =>
            items.map(item => (item.id === productId ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => setItems([]);

    const toggleCart = () => setIsOpen(!isOpen);

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = items.reduce((acc, item) => acc + item.precioActual * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                toggleCart,
                cartCount,
                cartTotal
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
