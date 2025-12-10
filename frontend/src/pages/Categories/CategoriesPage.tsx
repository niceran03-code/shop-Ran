import {
  useEffect,
  useState,
  type JSXElementConstructor,
  type ReactElement,
  type ReactNode,
  type ReactPortal,
} from "react";
import { Table, Button, Space, message, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
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
    } catch (err) {
      console.error(err);
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
      render: (
        text:
          | string
          | number
          | bigint
          | boolean
          | ReactElement<unknown, string | JSXElementConstructor<any>>
          | Iterable<ReactNode>
          | ReactPortal
          | Promise<
              | string
              | number
              | bigint
              | boolean
              | ReactPortal
              | ReactElement<unknown, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | null
              | undefined
            >
          | null
          | undefined,
        record: { id: any }
      ) => (
        <span
          style={{ cursor: "pointer", color: "#1677ff" }}
          onClick={() => navigate(`/products?category=${record.id}`)}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Actions",
      render: (record: { id: any }) => (
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
