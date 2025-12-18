import { useEffect, useState } from "react";
import { Table, Pagination, Typography, Select, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/axios";

interface User {
  id: number;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const pageSize = 10; // ✅ 固定 10，不给选
  const totalPages = Math.ceil(
    Number(searchParams.get("total") || 0) / pageSize
  );

  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const { Link } = Typography;

  //  当前登录用户 id（用于禁止改自己）
  const currentUserId = Number(localStorage.getItem("userId"));

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
  }, [page]);

  // 日期格式：YYYY-MM-DD
  const formatDate = (v: string) => v?.slice(0, 10) ?? "-";

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      fixed: "left",
    },
    {
      title: "Username",
      dataIndex: "username",
      width: 180,
      fixed: "left",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      width: 140,
      render: (role, record) => {
        const isSelf = record.id === currentUserId;

        return (
          <Select
            value={role}
            size="small"
            style={{ width: 120 }}
            disabled={isSelf} // 🚫 禁止改自己
            onChange={(newRole) => {
              Modal.confirm({
                title: "Change user role?",
                content: `Change ${record.username}'s role to ${newRole}?`,
                okText: "Confirm",
                cancelText: "Cancel",
                async onOk() {
                  await api.patch(`/users/${record.id}`, {
                    role: newRole,
                  });
                  message.success("Role updated");
                  fetchUsers();
                },
              });
            }}
            options={[
              { value: "USER", label: "USER" },
              { value: "ADMIN", label: "ADMIN" },
            ]}
          />
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 140,
      render: formatDate, // YYYY-MM-DD
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      width: 140,
      render: formatDate,
    },
    {
      title: "Actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Typography.Link
          onClick={() => navigate(`/products?userId=${record.id}`)}
        >
          Products
        </Typography.Link>
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

      {/* ⭐ 分页区（参考你第二张图） */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 16,
          alignItems: "center",
        }}
      >
        {/* 跳转到第几页 */}
        <Select
          value={page}
          style={{ width: 120 }}
          onChange={(p) =>
            setSearchParams({
              page: String(p),
            })
          }
        >
          {Array.from({ length: Math.ceil(total / pageSize) }).map(
            (_, index) => {
              const pageNumber = index + 1;
              return (
                <Select.Option key={pageNumber} value={pageNumber}>
                  Page {pageNumber}
                </Select.Option>
              );
            }
          )}
        </Select>

        {/* 页码 */}
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger={false} // ✅ 不给选 pageSize
          onChange={(p) =>
            setSearchParams({
              page: String(p),
            })
          }
        />
      </div>
    </>
  );
}
