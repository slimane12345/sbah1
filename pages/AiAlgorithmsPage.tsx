import React from 'react';
import type { AiAlgorithm } from '../types';
import AlgorithmCard from '../components/ai/AlgorithmCard';

const mockAlgorithms: AiAlgorithm[] = [
  {
    id: 'algo-1',
    name: 'تحسين مسارات التوصيل',
    description: 'يستخدم خوارزميات متقدمة لحساب أسرع وأكفأ مسار للمناديب لتوصيل طلبات متعددة، مما يقلل من وقت التوصيل وتكاليف الوقود.',
    status: 'نشط',
    modelName: 'RouteNet v2.1',
    metrics: {
      'متوسط توفير الوقت': '18%',
      'دقة التوقع': '95%',
      'آخر تدريب': '2023-10-25',
    },
    enabled: true,
  },
  {
    id: 'algo-2',
    name: 'توقع وقت التوصيل',
    description: 'يحلل البيانات التاريخية وحالة حركة المرور الحالية لتقديم تقديرات دقيقة لوقت وصول الطلبات للعملاء.',
    status: 'نشط',
    modelName: 'TimePred v1.5',
    metrics: {
      'متوسط الدقة': '± 3 دقائق',
      'الطلبات المحللة': '1.2 مليون',
      'آخر تحديث': 'يوميًا',
    },
    enabled: true,
  },
  {
    id: 'algo-3',
    name: 'توزيع الطلبات الذكي',
    description: 'يقوم بتعيين الطلبات الجديدة تلقائيًا للمندوب الأنسب بناءً على موقعه الحالي، حمولته، وتقييمه لتحقيق التوازن والكفاءة.',
    status: 'تحت الصيانة',
    modelName: 'DispatchAI v3.0',
    metrics: {
      'استراتيجية التوزيع': 'الأقرب والأعلى تقييمًا',
      'سرعة التعيين': '2.5 ثانية',
      'نسبة القبول': '92%',
    },
    enabled: true,
  },
  {
    id: 'algo-4',
    name: 'تحليل حركة الطلبات',
    description: 'يتنبأ بمناطق وأوقات الذروة للطلبات، مما يساعد في توجيه المناديب بشكل استباقي وتجهيز المطاعم للطلب المتوقع.',
    status: 'غير نشط',
    modelName: 'DemandForecaster v1.2',
    metrics: {
      'فترة التوقع': '6 ساعات قادمة',
      'أعلى منطقة متوقعة': 'حي العليا',
      'حالة النموذج': 'يحتاج إعادة تدريب',
    },
    enabled: false,
  },
];

const AiAlgorithmsPage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {mockAlgorithms.map(algo => (
        <AlgorithmCard key={algo.id} algorithm={algo} />
      ))}
    </div>
  );
};

export default AiAlgorithmsPage;