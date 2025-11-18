import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface RestaurantHeaderProps {
    name: any;
    cuisine: any;
    rating: number;
    reviewsCount: number;
    coverImage: string;
    logo: string;
    onBack: () => void;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = (props) => {
  const { t, translateField } = useLanguage();
  return (
    <div className="relative mb-8">
      {/* Back Button */}
      <button onClick={props.onBack} className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="h-56 sm:h-64 bg-cover bg-center" style={{ backgroundImage: `url(${props.coverImage})` }}>
        <div className="h-full w-full bg-black bg-opacity-20"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-start -mt-16">
            <div className="relative">
              <img src={props.logo} alt={translateField(props.name)} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg" />
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-extrabold text-gray-900">{translateField(props.name)}</h1>
            <p className="text-gray-600 mt-1">{translateField(props.cuisine)}</p>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <span className="flex items-center font-semibold ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {props.rating} ({props.reviewsCount} {t('ratingUnit')})
              </span>
              <span className="flex items-center font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-gray-500" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {t('etaRangeInMinutes')}
              </span>
            </div>
          </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;