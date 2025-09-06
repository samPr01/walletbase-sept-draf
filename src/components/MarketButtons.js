import Link from 'next/link';
import styles from './TradeButtons.module.css';

export default function MarketButtons({ coin, addToWishlist }) {
  return (
    <div className={styles.buttonGroup}>
      {/* Wishlist Button */}
      <button
        onClick={() => addToWishlist(coin.id)}
        className={styles.wishlistButton}
        title="Add to Wishlist"
      >
        ❤️
      </button>
      {/* Trade Button */}
      <Link href={`/trade/${coin.symbol.toUpperCase()}`} className={styles.tradeLink}>
        <button className={styles.tradeButton}>
          Trade
        </button>
      </Link>
    </div>
  );
}
