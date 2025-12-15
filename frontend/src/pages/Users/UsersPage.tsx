// frontend/src/pages/Users/UsersPage.tsx
import { useEffect, useState } from "react";
import { Table, Button, Space, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/axios";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);

  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users", {
        params: { page, pageSize },
      });
      setData(res.data.data);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "Username",
      dataIndex: "username",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      width: 120,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 180,
      render: (v) => new Date(v).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      width: 180,
      render: (v) => new Date(v).toLocaleString(),
    },
    {
      title: "Actions",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => navigate(`/products?userId=${record.id}&page=1`)}
          >
            Products
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        scroll={{ x: 1000 }}
      />

      {/* ✅ 分页：和 Products / Categories 一致 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 16,
        }}
      >
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          onChange={(p, ps) =>
            setSearchParams({
              page: String(p),
              pageSize: String(ps),
            })
          }
        />
      </div>
    </>
  );
}
