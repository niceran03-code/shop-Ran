import { useEffect, useState } from "react";
import { Table, Button, Space, message, Modal } from "antd";
import api from "../../utils/axios";

export default function RecycleBinPage() {
  const [deletedProducts, setDeletedProducts] = useState([]);

  // ---------------------------
  // Fetch deleted products
  // ---------------------------
  const fetchDeletedProducts = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await api.get("/product/deleted", {
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

          await api.patch(`/product/restore/${id}`, null, {
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

          await api.delete(`/product/force/${id}`, {
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
    { title: "Product Name", dataIndex: "name" },
    { title: "Deleted At", dataIndex: "deletedAt" },
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
      <h2>Recycle Bin</h2>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={deletedProducts}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
