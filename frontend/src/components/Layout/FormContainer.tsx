// frontend/src/components/layout/FormContainer.tsx
import { ReactNode } from "react";
import { Card } from "antd";

interface FormContainerProps {
  title?: string;
  children: ReactNode;
  maxWidth?: number;
}

export default function FormContainer({
  title,
  children,
  maxWidth = 720,
}: FormContainerProps) {
  return (
    <div
      style={{
        maxWidth,
        margin: "0 auto",
      }}
    >
      <Card
        title={title}
        bordered={false}
        style={{
          borderRadius: 8,
        }}
      >
        {children}
      </Card>
    </div>
  );
}
