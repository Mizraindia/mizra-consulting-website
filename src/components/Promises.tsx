import { PROMISES } from '@/lib/site';

// The four confirmed promises, shown where the old client-number blocks used to be.
export default function Promises({ variant }: { variant: 'band' | 'cards' }) {
  if (variant === 'band') {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {PROMISES.map((promise) => (
          <li key={promise.value} className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2 text-[#F8A90B]">{promise.value}</div>
            <div className="text-white/90">{promise.label}</div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {PROMISES.map((promise) => (
        <li key={promise.value} className="card text-center bg-gradient-to-br from-primary-50 to-beige-50">
          <div className="text-3xl font-bold text-primary-900 mb-2">{promise.value}</div>
          <div className="text-gray-700">{promise.label}</div>
        </li>
      ))}
    </ul>
  );
}
