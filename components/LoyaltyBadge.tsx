import React from 'react';
import type { LoyaltyTier } from '../types';

interface LoyaltyBadgeProps {
  tier: LoyaltyTier;
}

const tierColorMap: Record<LoyaltyTier, string> = {
  'برونزي': 'bg-yellow-700 text-white',
  'فضي': 'bg-gray-400 text-white',
  'ذهبي': 'bg-yellow-400 text-yellow-900',
  'بلاتيني': 'bg-blue-200 text-blue-900',
};

const LoyaltyBadge: React.FC<LoyaltyBadgeProps> = ({ tier }) => {
  const colorClass = tierColorMap[tier] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${colorClass}`}>
      {tier}
    </span>
  );
};

export default LoyaltyBadge;