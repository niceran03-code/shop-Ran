// frontend/src/pages/Products/ProductDetailPage.tsx
import DOMPurify from "dompurify";

interface Props {
  description?: string;
}

export default function ProductDescription({ description }: Props) {
  if (!description) return null;

  const safeHtml = DOMPurify.sanitize(description, {
    USE_PROFILES: { html: true },
  });

  return (
    <div
      className="product-description"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
