// frontend/src/pages/Auth/AuthPage.tsx
import { useState } from "react";
import { Card } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "./AuthPage.module.css";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className={styles.container}>
      <Card
        className={styles.card}
        title={mode === "login" ? "Admin Login" : "Register"}
      >
        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm onSwitch={() => setMode("register")} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RegisterForm onSwitch={() => setMode("login")} />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
