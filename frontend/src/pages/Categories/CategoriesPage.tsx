// frontend/src/pages/Categories/CategoriesPage.tsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Pagination,
  Typography,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const { Link } = Typography;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const navigate = useNavigate();
  const totalPages = Math.ceil(total / pageSize);

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
  // Table Columns (match Products fixed/scroll behavior)
  // ----------------------------------
  const columns: ColumnsType<any> = [
    {
      title: "Category Name",
      dataIndex: "name",
      width: 220,
      fixed: "left",
      render: (text: string, record: { id: number }) => (
        <Link
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products?category=${record.id}`);
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 140,
      render: (value: string) => (value ? value.slice(0, 10) : "-"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      width: 140,
      render: (value: string) => (value ? value.slice(0, 10) : "-"),
    },
    {
      title: "Actions",
      width: 180,
      fixed: "right",
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
        scroll={{ x: 800 }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        {/* Page Select */}
        <Select
          value={page}
          style={{ width: 120 }}
          onChange={(value) => setPage(value)}
        >
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            return (
              <Select.Option key={pageNumber} value={pageNumber}>
                Page {pageNumber}
              </Select.Option>
            );
          })}
        </Select>

        {/* Pagination */}
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
