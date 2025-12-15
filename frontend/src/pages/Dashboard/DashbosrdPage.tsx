// frontend/src/pages/Dashboard/DashboardPage.tsx
import { useEffect, useState } from "react";
import { message } from "antd";
import api from "../../utils/axios";
import styles from "./DashboardPage.module.css";

// 仪表盘：获取汇总统计与 7 天趋势，使用 Recharts 展示
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

/* -------------------- */
/* Types */
/* -------------------- */
type TrendPoint = {
  day: string;
  count: number;
};

type Summary = {
  totalProducts: number;
  totalCategories: number;
  activeAdmins: number;
  trend7d: TrendPoint[];
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await api.get("/dashboard/summary");
      setSummary(res.data);
    } catch {
      message.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.titleRow}>
        <h2 className={styles.title}>Dashboard Overview</h2>
        <div className={styles.subtitle}>
          Real-time summary for admin operations
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.labelRow}>
            <span className={styles.label}>Total Products</span>
            <span className={styles.badge}>Live</span>
          </div>
          <p className={styles.value}>{summary?.totalProducts ?? "-"}</p>
          <div className={styles.sub}>Excludes recycled items</div>
        </div>

        <div className={styles.card}>
          <div className={styles.labelRow}>
            <span className={styles.label}>Total Categories</span>
            <span className={styles.badge}>Live</span>
          </div>
          <p className={styles.value}>{summary?.totalCategories ?? "-"}</p>
          <div className={styles.sub}>All category nodes</div>
        </div>

        <div className={styles.card}>
          <div className={styles.labelRow}>
            <span className={styles.label}>Active Admins</span>
            <span className={styles.badge}>Now</span>
          </div>
          <p className={styles.value}>{summary?.activeAdmins ?? "-"}</p>
          <div className={styles.sub}>Role = ADMIN</div>
        </div>
      </div>

      {/* Chart (full width) */}
      <div style={{ marginTop: 16 }}>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Products created (last 7 days)</h3>

          {loading && <div className={styles.skeleton} />}

          {!loading && (
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary?.trend7d ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
