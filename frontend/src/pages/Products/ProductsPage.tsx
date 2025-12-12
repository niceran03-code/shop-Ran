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
  TreeSelect,
  Switch,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/axios";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface CategoryNode {
  id: number;
  name: string;
  children?: CategoryNode[];
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ---------------------------
  // Pagination
  // ---------------------------
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // ---------------------------
  // Data
  // ---------------------------
  const [products, setProducts] = useState<any[]>([]);

  // ---------------------------
  // Category tree
  // ---------------------------
  const [categoryTree, setCategoryTree] = useState<any[]>([]);

  // ---------------------------
  // Draft filters（输入态，不触发搜索）
  // ---------------------------
  const [draftName, setDraftName] = useState("");
  const [draftCategoryId, setDraftCategoryId] = useState<number | undefined>();

  // ---------------------------
  // Applied filters（生效态，用于查询）
  // ---------------------------
  const [searchName, setSearchName] = useState("");
  const [categoryIdFilter, setCategoryIdFilter] = useState<
    number | undefined
  >();

  // URL category (?category=ID)
  const categoryIdFromUrl = searchParams.get("category");

  // ---------------------------
  // Fetch category tree
  // ---------------------------
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories/tree");
      setCategoryTree(transformToTreeSelect(res.data.data ?? res.data));
    } catch {
      message.error("Failed to load categories");
    }
  };

  // 把后端 category tree 转成 TreeSelect 结构
  const transformToTreeSelect = (nodes: CategoryNode[]): any[] => {
    return nodes.map((node) => ({
      title: node.name,
      value: node.id,
      key: node.id,
      children: node.children
        ? transformToTreeSelect(node.children)
        : undefined,
    }));
  };

  // ---------------------------
  // Fetch products（唯一入口）
  // ---------------------------
  const fetchProducts = async () => {
    try {
      const res = await api.get("/product", {
        params: {
          page,
          pageSize,
          name: searchName || undefined,
          categoryId: categoryIdFilter || undefined,
        },
      });

      setProducts(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      message.error("Failed to load products");
    }
  };

  // ---------------------------
  // Effects
  // ---------------------------
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize, searchName, categoryIdFilter]);

  useEffect(() => {
    if (categoryIdFromUrl) {
      const id = Number(categoryIdFromUrl);
      setDraftCategoryId(id);
      setCategoryIdFilter(id);
      setPage(1);
    }
  }, [categoryIdFromUrl]);

  // ---------------------------
  // Delete (soft delete)
  // ---------------------------
  const deleteProduct = async (id: number) => {
    Modal.confirm({
      title: "Delete product?",
      centered: true,
      content: "This product will be moved to the recycle bin.",
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
  // Toggle product status
  // ---------------------------
  const toggleStatus = async (id: number) => {
    try {
      await api.patch(`/product/${id}/status`);
      message.success("Status updated");
      fetchProducts(); // ⭐ 关键：刷新当前列表
    } catch {
      message.error("Failed to update status");
    }
  };

  // ---------------------------
  // Table columns（⭐ 自适应保留 ⭐）
  // ---------------------------
  const columns: ColumnsType<any> = [
    { title: "ID", dataIndex: "id", width: 60, fixed: "left" },
    { title: "Name", dataIndex: "name", fixed: "left" },

    { title: "Price", dataIndex: "price", responsive: ["md"] },
    { title: "Stock", dataIndex: "stock", responsive: ["md"] },
    {
      title: "Status",
      dataIndex: "isActive",
      responsive: ["md"],
      render: (_: any, record: any) => (
        <Switch
          checked={record.isActive}
          onChange={() => toggleStatus(record.id)}
        />
      ),
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
          <Button onClick={() => navigate(`/products/edit/${record.id}`)}>
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
      {/* Create */}
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/products/create")}
      >
        Create Product
      </Button>

      {/* Filter Bar */}
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
          placeholder="Search by name"
          style={{ width: 220 }}
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
        />

        <TreeSelect
          style={{ width: 260 }}
          placeholder="Select category"
          allowClear
          treeDefaultExpandAll
          value={draftCategoryId}
          treeData={categoryTree}
          onChange={(v) => setDraftCategoryId(v)}
        />

        <Button
          icon={<SearchOutlined />}
          type="primary"
          onClick={() => {
            setSearchName(draftName);
            setCategoryIdFilter(draftCategoryId);
            setPage(1);
          }}
        >
          Search
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        pagination={false}
        scroll={{ x: 1200 }}
      />

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 20,
        }}
      >
        <Tooltip title="Recycle Bin">
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => navigate("/products/recycle")}
          />
        </Tooltip>

        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
        />
      </div>
    </div>
  );
}
