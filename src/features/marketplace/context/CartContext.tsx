import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
    openCart: () => void;
    closeCart: () => void;
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

    const addToCart = useCallback((product: Product) => {
        const isService = product.itemType === 'service' || String(product.id).startsWith('service_');

        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === product.id);

            if (existingItem) {
                // Services can only have quantity 1
                if (isService) return currentItems;

                // Don't exceed stock
                if (existingItem.quantity >= product.stock) return currentItems;

                return currentItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentItems, { ...product, quantity: 1 }];
        });
        setIsOpen(true);
    }, []);

    const removeFromCart = useCallback((productId: number | string) => {
        setItems(prev => prev.filter(item => item.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: number | string, quantity: number) => {
        // Prevent negative or zero
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems(prev =>
            prev.map(item => {
                if (item.id !== productId) return item;

                const isService = item.itemType === 'service' || String(item.id).startsWith('service_');

                // Services always stay at 1
                if (isService) return item;

                // Clamp to available stock
                const clampedQty = Math.min(quantity, item.stock);
                return { ...item, quantity: clampedQty };
            })
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => setItems([]), []);
    const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);
    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);

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
                openCart,
                closeCart,
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
