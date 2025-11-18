import React from 'react';
import type { Review } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface ReviewsProps {
    reviews: Review[];
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex">
        {[...Array(5)].map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
    const { t } = useLanguage();
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('ratings')}</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="flex items-start">
                            <img src={review.avatar} alt={review.author} className="h-10 w-10 rounded-full object-cover" />
                            <div className="mr-4">
                                <div className="flex items-center">
                                    <p className="font-bold text-gray-900">{review.author}</p>
                                    <span className="text-xs text-gray-600 mx-2">•</span>
                                    <p className="text-xs text-gray-600">{review.date}</p>
                                </div>
                                <StarRating rating={review.rating} />
                                <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reviews;