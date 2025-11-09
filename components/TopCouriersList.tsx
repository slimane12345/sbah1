import React from 'react';
import type { TopCourier } from '../types';

const mockTopCouriers: TopCourier[] = [
  { id: 'C006', name: 'فهد المطيري', avatar: 'https://i.pravatar.cc/150?img=6', deliveries: 300 },
  { id: 'C002', name: 'محمد عبدالله', avatar: 'https://i.pravatar.cc/150?img=2', deliveries: 210 },
  { id: 'C008', name: 'تركي الشمري', avatar: 'https://i.pravatar.cc/150?img=8', deliveries: 180 },
  { id: 'C004', name: 'سلطان القحطاني', avatar: 'https://i.pravatar.cc/150?img=4', deliveries: 150 },
  { id: 'C010', name: 'بدر الزهراني', avatar: 'https://i.pravatar.cc/150?img=10', deliveries: 130 },
];

const TopCouriersList: React.FC = () => {
  return (
    <div className="space-y-4">
      {mockTopCouriers.map((courier, index) => (
        <div key={courier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
            <img className="h-10 w-10 rounded-full object-cover mx-4" src={courier.avatar} alt={courier.name} />
            <span className="font-semibold text-gray-800">{courier.name}</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-blue-600">{courier.deliveries}</p>
            <p className="text-xs text-gray-500">توصيلة</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopCouriersList;
