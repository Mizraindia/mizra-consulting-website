import { formatInr } from '@/lib/money';

/**
 * "Pay ₹99 and register": opens the class's Razorpay payment page in a new tab. The link has
 * already been checked (https on rzp.io or razorpay.com only) in the script and in lib/classes.
 */
export default function PayButton({
  href,
  priceInr,
  classTitle,
  size = 'large',
}: {
  href: string;
  priceInr: number;
  classTitle: string;
  size?: 'large' | 'small';
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-full bg-mz-accent font-semibold text-white hover:bg-mz-deep ${
        size === 'large' ? 'min-h-[54px] w-full px-6 text-[17px]' : 'min-h-[46px] px-6 text-[15px]'
      }`}
    >
      Pay {formatInr(priceInr)} and register
      <span className="sr-only">
        {' '}
        for {classTitle} (opens Razorpay&apos;s payment page in a new tab)
      </span>
    </a>
  );
}
