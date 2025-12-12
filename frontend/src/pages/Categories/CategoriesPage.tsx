// frontend/src/pages/Categories/CategoriesPage.tsx
import { useEffect, useState } from "react";
import { Table, Button, Space, message, Pagination, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const { Link } = Typography;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const navigate = useNavigate();

  // ----------------------------------
  // Fetch paginated tree
  // ----------------------------------
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories/tree", {
        params: { page, pageSize },
      });

      setCategories(res.data.data);
      setTotal(res.data.total);
    } catch {
      message.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  // ----------------------------------
  // Table Columns
  // ----------------------------------
  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      render: (text: string, record: { id: number }) => (
        <Link
          onClick={(e) => {
            e.stopPropagation(); // ✅ 防止冒泡
            navigate(`/products?category=${record.id}`);
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Actions",
      render: (record: { id: number }) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/categories/edit/${record.id}`)}
          >
            Edit
          </Button>

          <Button danger>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/categories/create")}
      >
        Create Category
      </Button>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={categories}
        pagination={false}
      />

      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
