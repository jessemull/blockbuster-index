import { Clapperboard } from 'lucide-react';
import Link from 'next/link';

const NotFoundPage = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-4 text-center">
    <div className="flex flex-col items-center max-w-xl w-full">
      <div className="text-white mb-6 flex justify-center">
        <Clapperboard
          className="w-[20vw] h-[20vw] max-w-[160px] max-h-[160px]"
          stroke="#CD1C18"
          strokeWidth="1"
        />
      </div>
      <h1 className="text-xl md:text-2xl font-bold text-white mb-4">
        Page Not Found
      </h1>
      <p className="text-md md:text-lg text-gray-300 mb-6">
        That route is not part of the Blockbuster Index.
      </p>
      <Link
        className="text-brand-yellow text-2xl hover:underline transition-colors"
        href="/"
      >
        Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
