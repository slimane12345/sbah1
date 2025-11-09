import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface OrderTrackerProps {
    order: {
        orderNumber: string;
        deliveryAddress: {
            addressText: string;
        };
    };
}


const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  const { t } = useLanguage();
  const steps = [
    { name: t('step1'), completed: true },
    { name: t('step2'), completed: true },
    { name: t('step3'), completed: false },
    { name: t('step4'), completed: false },
    { name: t('step5'), completed: false },
  ];

  const etaRangeStart = 10;
  const etaRangeEnd = 15;
  const etaDisplay = t('etaValue', { start: etaRangeStart.toString(), end: etaRangeEnd.toString() });

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-12" dir={t('language') === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h1 className="text-2xl font-bold">{t('orderConfirmedSuccess')}</h1>
            <p className="text-gray-600 mt-2">{t('orderNumberInfo', { orderNumber: order.orderNumber })}</p>

            <div className="mt-8">
              <div className="flex items-center">
                {steps.map((step, index) => (
                  <React.Fragment key={step.name}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {step.completed ? (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                       <p className={`text-xs mt-2 text-center w-20 ${step.completed ? 'font-semibold text-blue-600' : 'text-gray-500'}`}>{step.name}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 ${steps[index+1].completed ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t pt-6 text-sm text-gray-700">
                <p>{t('eta')}: <span className="font-bold">{etaDisplay}</span></p>
                <p className="mt-2">{t('deliveryDestination')}: <span className="font-bold">{order.deliveryAddress.addressText}</span></p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;