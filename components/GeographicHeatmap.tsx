import React from 'react';

const GeographicHeatmap: React.FC = () => {
  return (
    <div className="relative h-full min-h-[300px] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
      {/* This is a decorative representation of a heatmap */}
      <div className="absolute w-40 h-40 bg-red-400 rounded-full opacity-30 blur-2xl top-10 right-10"></div>
      <div className="absolute w-32 h-32 bg-orange-400 rounded-full opacity-30 blur-2xl top-20 left-20"></div>
      <div className="absolute w-48 h-48 bg-red-500 rounded-full opacity-40 blur-2xl bottom-5 left-1/4"></div>
      <div className="absolute w-24 h-24 bg-yellow-300 rounded-full opacity-50 blur-xl bottom-1/3 right-1/4"></div>
      
      <div className="z-10 text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg">
        <h4 className="text-lg font-bold text-gray-800">خريطة الطلبات الحالية</h4>
        <p className="text-sm text-gray-600 mt-1">تمثيل مرئي للمناطق الأكثر كثافة في الطلبات.</p>
        <div className="mt-4 space-y-2 text-right">
            <p className="flex items-center"><span className="w-4 h-4 rounded-full bg-red-500 ml-2"></span> منطقة الرياض - العليا (كثافة عالية)</p>
            <p className="flex items-center"><span className="w-4 h-4 rounded-full bg-orange-400 ml-2"></span> منطقة جدة - الحمراء (كثافة متوسطة)</p>
            <p className="flex items-center"><span className="w-4 h-4 rounded-full bg-yellow-300 ml-2"></span> منطقة الدمام - الشاطئ (كثافة منخفضة)</p>
        </div>
      </div>
    </div>
  );
};

export default GeographicHeatmap;
