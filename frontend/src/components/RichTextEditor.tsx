// frontend/src/components/RichTextEditor.tsx
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { useState } from "react";
import api from "../utils/axios";

interface Props {
  value?: string;
  onChange?: (val: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const [editor, setEditor] = useState<any>(null);

  const editorConfig = {
    placeholder: "Enter product description...",
    MENU_CONF: {
      uploadImage: {
        customUpload: async (file: File, insertFn: (url: string) => void) => {
          const formData = new FormData();
          formData.append("file", file);

          const res = await api.post("/upload/image", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          insertFn(res.data.url);
        },
      },
    },
  };

  return (
    <div style={{ border: "1px solid #d9d9d9" }}>
      <Toolbar editor={editor} />
      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        onChange={(editor) => onChange?.(editor.getHtml())}
        style={{ height: 300 }}
      />
    </div>
  );
}
