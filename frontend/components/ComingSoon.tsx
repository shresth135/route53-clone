import { Info } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[60vh] bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <Info className="w-12 h-12 text-blue-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Feature Coming Soon
      </h2>
    </div>
  );
}