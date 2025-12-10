import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to Admin Dashboard</h2>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total Products</h3>
          <p>128</p>
        </div>

        <div className={styles.card}>
          <h3>Total Categories</h3>
          <p>12</p>
        </div>

        <div className={styles.card}>
          <h3>Admins Online</h3>
          <p>1</p>
        </div>
      </div>
    </div>
  );
}
