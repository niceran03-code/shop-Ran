// frontend/src/pages/Products/ProductsPage.tsx
import { useEffect, useMemo, useState } from "react";
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
  Select,
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

interface UserOption {
  id: number;
  username: string;
  email: string;
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ URL params（必须在组件内）
  const categoryIdFromUrl = searchParams.get("category");
  const userIdFromUrl = searchParams.get("userId");

  // ---------------------------
  // Pagination
  // ---------------------------
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / pageSize);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  // ---------------------------
  // Data
  // ---------------------------
  const [products, setProducts] = useState<any[]>([]);

  // ---------------------------
  // Category tree
  // ---------------------------
  const [categoryTree, setCategoryTree] = useState<any[]>([]);

  // ---------------------------
  // Users options (for Select)
  // ---------------------------
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  // ---------------------------
  // Draft filters（输入态，不触发搜索）
  // ---------------------------
  const [draftName, setDraftName] = useState("");
  const [draftCategoryId, setDraftCategoryId] = useState<number | undefined>();

  // ✅ Draft user filter（下拉选择）
  const [draftUserId, setDraftUserId] = useState<number | undefined>();

  // ---------------------------
  // Applied filters（生效态，用于查询）
  // ---------------------------
  const [searchName, setSearchName] = useState("");
  const [categoryIdFilter, setCategoryIdFilter] = useState<
    number | undefined
  >();

  // ✅ Applied user filter（后端用 userId）
  const [userIdFilter, setUserIdFilter] = useState<number | undefined>();

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
  // Fetch users options（用于下拉）
  // 说明：这里用你现有 /users 接口（需要支持分页版 data/total，后端你马上会改）
  // 先取前 200 个用户作为选项，足够后台管理使用
  // ---------------------------
  const fetchUserOptions = async () => {
    setUserLoading(true);
    try {
      const res = await api.get("/users", {
        params: { page: 1, pageSize: 200 },
      });

      // 兼容两种返回：分页 {data,total} 或旧数组
      const list: any[] = Array.isArray(res.data) ? res.data : res.data.data;

      const options = (list || []).map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
      }));

      setUserOptions(options);
    } catch {
      // 不强制报错（防止你后端还没改完导致页面无法使用）
      setUserOptions([]);
    } finally {
      setUserLoading(false);
    }
  };

  const userSelectOptions = useMemo(
    () =>
      userOptions.map((u) => ({
        value: u.id,
        // label 做得“好看+可搜索”
        label: `${u.username} (${u.email}) #${u.id}`,
      })),
    [userOptions]
  );

  // ---------------------------
  // Fetch products（唯一入口）
  // ---------------------------
  const fetchProducts = async () => {
    try {
      // ✅ URL 优先级：URL > Filter
      const effectiveCategoryId =
        categoryIdFromUrl !== null
          ? Number(categoryIdFromUrl)
          : categoryIdFilter;

      const effectiveUserId =
        userIdFromUrl !== null ? Number(userIdFromUrl) : userIdFilter;

      const res = await api.get("/product", {
        params: {
          page,
          pageSize,
          name: searchName || undefined,
          categoryId: effectiveCategoryId || undefined,
          // ✅ 关键：用 effectiveUserId，而不是 userIdFilter
          userId: effectiveUserId || undefined,
        },
      });

      setProducts(res.data.data);
      setTotal(res.data.total);
    } catch {
      message.error("Failed to load products");
    }
  };

  // ---------------------------
  // Effects
  // ---------------------------
  useEffect(() => {
    fetchCategories();
    fetchUserOptions(); // ✅ 进页面加载用户下拉
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [
    page,
    pageSize,
    searchName,
    categoryIdFilter,
    userIdFilter,
    categoryIdFromUrl,
    userIdFromUrl,
  ]);

  // URL category (?category=ID) → 自动筛选（你原来就有）
  useEffect(() => {
    if (categoryIdFromUrl) {
      const id = Number(categoryIdFromUrl);
      setDraftCategoryId(id);
      setCategoryIdFilter(id);
      setPage(1);
    }
  }, [categoryIdFromUrl]);

  // ✅ URL userId (?userId=ID) → 自动筛选（新增）
  useEffect(() => {
    if (userIdFromUrl) {
      const id = Number(userIdFromUrl);

      // 填充 UI（下拉显示）
      setDraftUserId(id);

      // 生效 filter
      setUserIdFilter(id);

      // 回到第一页
      setPage(1);
    }
  }, [userIdFromUrl]);

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
      fetchProducts();
    } catch {
      message.error("Failed to update status");
    }
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: "Delete selected products?",
      content: "Selected products will be moved to the recycle bin.",
      okType: "danger",
      onOk: async () => {
        await api.post("/product/batch/delete", {
          ids: selectedRowKeys,
        });
        message.success("Products deleted");
        setSelectedRowKeys([]);
        fetchProducts();
      },
    });
  };

  const handleBatchStatus = async (isActive: boolean) => {
    await api.post("/product/batch/status", {
      ids: selectedRowKeys,
      isActive,
    });
    message.success(isActive ? "Products published" : "Products unpublished");
    setSelectedRowKeys([]);
    fetchProducts();
  };

  // ---------------------------
  // Table columns（你原来的都保留）
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
      title: "Created At",
      dataIndex: "createdAt",
      responsive: ["lg"],
      render: (value: string) => (value ? value.slice(0, 10) : "-"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      responsive: ["lg"],
      render: (value: string) => (value ? value.slice(0, 10) : "-"),
    },

    {
      title: "Category",
      dataIndex: ["category", "name"],
      responsive: ["xl"],
    },
    {
      title: "Created By",
      dataIndex: ["user", "username"],
      responsive: ["xl"],
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
      responsive: ["xxl"],
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
      {/* Create */}
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/products/create")}
      >
        Create Product
      </Button>

      {selectedRowKeys.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <Button danger onClick={handleBatchDelete}>
            Batch Delete
          </Button>
          <Button onClick={() => handleBatchStatus(true)}>Batch Publish</Button>
          <Button onClick={() => handleBatchStatus(false)}>
            Batch Unpublish
          </Button>
        </div>
      )}

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

        {/* ✅ 用户下拉选择（替代手输 ID/Name） */}
        <Select
          showSearch
          allowClear
          loading={userLoading}
          style={{ width: 320 }}
          placeholder="Select user (search username/email/id)"
          value={draftUserId}
          options={userSelectOptions}
          optionFilterProp="label"
          onChange={(v) => setDraftUserId(v)}
          filterOption={(input, option) => {
            const label = String(option?.label ?? "").toLowerCase();
            return label.includes(input.toLowerCase());
          }}
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

            // ✅ 生效 userId
            setUserIdFilter(draftUserId || undefined);

            setPage(1);
          }}
        >
          Search
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as number[]),
        }}
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
          alignItems: "center",
        }}
      >
        {/* Recycle Bin */}
        <Tooltip title="Recycle Bin">
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => navigate("/products/recycle")}
          />
        </Tooltip>

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
