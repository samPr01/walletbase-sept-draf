import Link from 'next/link';
import styles from './TradeButtons.module.css';

export default function HomeTradeButton({ coin }) {
  return (
    <Link href={`/trade/${coin.symbol.toUpperCase()}`} className={styles.tradeLink}>
      <button className={styles.tradeButton}>
        Trade
      </button>
    </Link>
  );
}
