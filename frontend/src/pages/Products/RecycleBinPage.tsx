// frontend/src/pages/Products/RecycleBinPage.tsx
import { useEffect, useState } from "react";
import { Table, Button, Space, message, Modal } from "antd";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";

export default function RecycleBinPage() {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  // ---------------------------
  // Fetch deleted products
  // ---------------------------
  const fetchDeletedProducts = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await api.get("/products/deleted", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDeletedProducts(res.data);
    } catch (err) {
      message.error("Failed to load recycle bin");
    }
  };

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  // ---------------------------
  // Restore Product
  // ---------------------------
  const restoreProduct = async (id: number) => {
    Modal.confirm({
      title: "Restore product?",
      centered: true,
      content: "This product will become active again.",
      okText: "Restore",
      cancelText: "Cancel",

      async onOk() {
        try {
          const token = localStorage.getItem("accessToken");

          await api.patch(`/products/${id}/restore`, null, {
            headers: { Authorization: `Bearer ${token}` },
          });

          message.success("Product restored");
          fetchDeletedProducts();
        } catch {
          message.error("Restore failed");
        }
      },
    });
  };
  const handleBatchRestore = async () => {
    Modal.confirm({
      title: "Restore selected products?",
      content: "Selected products will become active again.",
      onOk: async () => {
        await api.post("/products/batch/restore", {
          ids: selectedRowKeys,
        });
        message.success("Products restored");
        setSelectedRowKeys([]);
        fetchDeletedProducts();
      },
    });
  };

  const handleBatchForceDelete = () => {
    Modal.confirm({
      title: "Delete selected products permanently?",
      content: "This action cannot be undone.",
      okType: "danger",
      onOk: async () => {
        await api.post("/products/batch/force-delete", {
          ids: selectedRowKeys,
        });
        message.success("Products permanently deleted");
        setSelectedRowKeys([]);
        fetchDeletedProducts();
      },
    });
  };
  // ---------------------------
  // Permanently Delete Product
  // ---------------------------
  const forceDeleteProduct = (id: number) => {
    Modal.confirm({
      title: "Delete permanently?",
      centered: true,
      content: "This action cannot be undone.",
      okText: "Delete forever",
      okType: "danger",
      cancelText: "Cancel",

      async onOk() {
        try {
          const token = localStorage.getItem("accessToken");

          await api.delete(`/products/force/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          message.success("Product permanently deleted");
          fetchDeletedProducts();
        } catch {
          message.error("Permanent delete failed");
        }
      },
    });
  };

  // ---------------------------
  // Table
  // ---------------------------
  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
    },
    {
      title: "Deleted At",
      dataIndex: "deletedAt",
      render: (value: string) => (value ? value.slice(0, 10) : "-"),
    },
    {
      title: "Actions",
      render: (record: any) => (
        <Space>
          <Button type="primary" onClick={() => restoreProduct(record.id)}>
            Restore
          </Button>
          <Button danger onClick={() => forceDeleteProduct(record.id)}>
            Delete Forever
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/products")}
      >
        Back to Products
      </Button>
      <h2>Recycle Bin</h2>

      {selectedRowKeys.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <Button type="primary" onClick={handleBatchRestore}>
            Batch Restore
          </Button>

          <Button danger onClick={handleBatchForceDelete}>
            Permanently Delete
          </Button>
        </div>
      )}

      <Table
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as number[]),
        }}
        columns={columns}
        dataSource={deletedProducts}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
