// frontend/src/pages/Products/ProductsPage.tsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Modal,
  Tooltip,
  Pagination,
  Input,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/axios";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  // ---------------------------
  // State
  // ---------------------------
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 搜索字段
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [categoryIdFilter, setCategoryIdFilter] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  // 分类传参 (?category=ID)
  const categoryIdFromUrl = searchParams.get("category");

  // ---------------------------
  // Fetch all products
  // ---------------------------
  const fetchProducts = async () => {
    try {
      const res = await api.get("/product", {
        params: {
          page,
          pageSize,
        },
      });

      setProducts(res.data.data); // 给 Table 的数组
      setTotal(res.data.total); //  给 Pagination 用
    } catch (err) {
      console.error(err);
      message.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize]);

  // ---------------------------
  // 搜索产品
  // ---------------------------
  const handleSearch = async () => {
    try {
      const res = await api.get("/product/search", {
        params: {
          id: searchId || undefined,
          name: searchName || undefined,
          category: categoryIdFilter || undefined,
          subCategory: subCategoryId || undefined,
        },
      });

      setProducts(res.data);
    } catch (err) {
      console.error(err);
      message.error("Search failed");
    }
  };

  // ---------------------------
  // 从分类页面跳转自动过滤
  // ---------------------------
  useEffect(() => {
    if (categoryIdFromUrl) {
      setCategoryIdFilter(categoryIdFromUrl);
      handleSearch();
    }
  }, [categoryIdFromUrl]);

  // ---------------------------
  // 删除产品（软删除）
  // ---------------------------
  const deleteProduct = async (id: number) => {
    Modal.confirm({
      title: "Delete product?",
      centered: true,
      content: "This product will be moved to the recycle bin for 7 days.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",

      async onOk() {
        try {
          await api.delete(`/product/${id}`);
          message.success("Product moved to recycle bin");
          fetchProducts();
        } catch {
          message.error("Delete failed");
        }
      },
    });
  };

  // ---------------------------
  // 表格列（响应式）
  // ---------------------------
  const columns: ColumnsType<any> = [
    { title: "ID", dataIndex: "id", width: 60, fixed: "left" },
    { title: "Name", dataIndex: "name", fixed: "left" },
    { title: "Price", dataIndex: "price", responsive: ["md"] },
    { title: "Stock", dataIndex: "stock", responsive: ["md"] },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (v) => (v ? "Active" : "Inactive"),
      responsive: ["md"],
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      responsive: ["lg"],
    },
    {
      title: "Created By",
      dataIndex: ["user", "username"],
      responsive: ["lg"],
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
      responsive: ["xl"],
    },
    {
      title: "Deleted At",
      dataIndex: "deletedAt",
      responsive: ["xl"],
    },
    {
      title: "Actions",
      fixed: "right",
      render: (record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/products/edit/${record.id}`)}
          >
            Edit
          </Button>
          <Button danger onClick={() => deleteProduct(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 创建产品 */}
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/products/create")}
      >
        Create Product
      </Button>

      {/* 搜索区域 */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Input
          placeholder="Search by ID"
          style={{ width: 160 }}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        <Input
          placeholder="Search by Name"
          style={{ width: 200 }}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        <Input
          placeholder="Category ID"
          style={{ width: 160 }}
          value={categoryIdFilter}
          onChange={(e) => setCategoryIdFilter(e.target.value)}
        />

        <Input
          placeholder="Sub Category ID"
          style={{ width: 160 }}
          value={subCategoryId}
          onChange={(e) => setSubCategoryId(e.target.value)}
        />

        <Button icon={<SearchOutlined />} type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* 产品表格 */}
      <Table<any>
        rowKey="id"
        columns={columns}
        dataSource={products}
        pagination={false}
        scroll={{ x: 1200 }}
      />

      {/* 底部 回收站 + 分页 UI */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Tooltip title="Recycle Bin">
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => navigate("/recycle-bin")}
          />
        </Tooltip>

        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
        />
      </div>
    </div>
  );
}
