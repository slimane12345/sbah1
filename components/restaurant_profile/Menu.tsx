import React, { useState, useRef, useEffect } from 'react';
import type { Product } from '../../types';
import ProductCard from './ProductCard';
import { useLanguage } from '../../contexts/LanguageContext';

interface MenuProps {
    menu: { [key: string]: Product[] };
    onProductClick: (product: Product) => void;
}

const Menu: React.FC<MenuProps> = ({ menu, onProductClick }) => {
    const [isSticky, setIsSticky] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const categoryRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
    const { translateField } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            if (navRef.current) {
                const navTop = navRef.current.getBoundingClientRect().top;
                // Stick when the top of the navRef placeholder hits the top of the viewport
                setIsSticky(navTop <= 0);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToCategory = (id: string) => {
        const element = categoryRefs.current[id];
        if (element) {
            const yOffset = -80; // Account for sticky nav height and some padding
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
        }
    };
    
    const menuCategories = Object.keys(menu);
    if(menuCategories.length === 0) return null;

    return (
        <div className="mt-8">
            <div ref={navRef} className="h-14"> {/* Placeholder for the sticky nav */}
                <nav className={`bg-white transition-all duration-200 ${isSticky ? 'fixed top-16 left-0 right-0 shadow-md z-30 border-b' : 'relative'}`}>
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="flex items-center space-x-4 space-x-reverse overflow-x-auto scrollbar-hide">
                           {menuCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => scrollToCategory(category)}
                                    className="px-3 py-4 text-sm font-semibold text-gray-600 whitespace-nowrap hover:text-blue-600 focus:outline-none border-b-2 border-transparent hover:border-blue-500"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>

            <div className="space-y-12">
                {Object.entries(menu).map(([category, items]) => (
                    <div 
                        key={category}
                        // Fix: The ref callback was implicitly returning the assigned element, which is not a valid
                        // ref callback return type. Wrapping the assignment in curly braces ensures it returns void.
                        ref={el => { categoryRefs.current[category] = el; }}
                        className="pt-4" // Padding top to account for sticky nav height
                    >
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">{category}</h2>
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            {(items as Product[]).map(item => <ProductCard key={item.id} product={item} onClick={() => onProductClick(item)} layout="vertical" showDescription={false} />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;