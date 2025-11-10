

import React from 'react';
import type { Banner } from '../../types';

interface OffersCarouselProps {
    banners: Banner[];
    onBannerClick: (link: string) => void;
}

const OffersCarousel: React.FC<OffersCarouselProps> = ({ banners, onBannerClick }) => {
    if (!banners || banners.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="grid grid-flow-col auto-cols-[90%] sm:auto-cols-[45%] md:auto-cols-[30%] gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
                {banners.map(banner => (
                    <button
                        key={banner.id}
                        onClick={() => onBannerClick(banner.link)}
                        className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer w-full text-right focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        style={{ scrollSnapAlign: 'start' }}
                    >
                        <div className="relative h-48 w-full">
                             <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                             <div className="absolute bottom-0 right-0 p-4">
                                 <h3 className="font-bold text-white text-xl">{banner.title}</h3>
                                 {banner.subtitle && <p className="text-white text-sm mt-1">{banner.subtitle}</p>}
                             </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default OffersCarousel;