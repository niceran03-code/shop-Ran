# Cursor Rules for Team

## 维护人 (Maintainers)

公司所有成员均可提交 PR 进行维护。

- **问题反馈**:

  Leo Zhou(<leo.zhou@silksoftware.com>)
  
## 概述 (Overview)

这是一套专为Silk研发团队设计的 Cursor Rules，涵盖了多种技术栈和业务场景。这些规则旨在确保代码质量、团队协作效率和项目一致性。

### 技术栈规范 (Tech Stack Standards)

- **包管理器**: 统一使用 [pnpm](https://pnpm.io/) 作为包管理器
- **开发语言**: TypeScript 优先
- **前端框架**: React + TypeScript
- **后端框架**: Node.js (NestJS)
- **数据库**: PostgreSQL
- **云服务**: AWS / 华为云

## 📁 规则文件结构 (Rule Files Structure)

```bash
cursor-rules-team/
├── README.md                    # 使用说明 (This file)
├── general-rules.mdc           # 通用开发规则
├── frontend-rules.mdc          # 前端开发规则
├── backend-rules.mdc           # 后端开发规则
├── database-rules.mdc          # 数据库规则
├── cloud-rules.mdc             # 云服务规则
├── bigcommerce-rules.mdc       # BigCommerce 集成规则
├── bc-catalyst.mdc             # BigCommerce Catalyst 开发规则
└── deployment-rules.mdc        # 部署规则
```

## 🚀 快速开始 (Quick Start)

### 1. 环境设置 (Environment Setup)

确保你的 Cursor 编辑器已正确配置：

1. **安装 Cursor**: 从 [cursor.sh](https://cursor.sh) 下载并安装
2. **安装 pnpm**: 确保使用 pnpm 作为包管理器

   ```bash
   npm install -g pnpm
   ```

3. **配置工作区**: 将这些规则文件放在规则目录中

### 2. 规则文件使用 (Using Rule Files)

#### 方法一：直接引用 (Direct Reference)

在 Cursor 中直接引用特定的规则文件：

```bash
@general-rules.mdc
@frontend-rules.mdc
@backend-rules.mdc
```

#### 方法二：组合使用 (Combined Usage)

根据项目需求组合多个规则文件：

```bash
@general-rules.mdc @frontend-rules.mdc @bigcommerce-rules.mdc
```

## 📋 规则文件详解 (Detailed Rule Files)

### 1. general-rules.mdc - 通用开发规则

**适用场景**: 所有项目的基础规则

**主要内容**:

- 开发流程规范（设计优先原则）
- Git 约定式提交规范
- 代码风格和命名规范
- 团队协作流程
- 代码审查标准

**使用示例**:

```bash
@general-rules.mdc
请帮我创建一个新的用户管理模块，遵循设计优先原则
```

### 2. frontend-rules.mdc - 前端开发规则

**适用场景**: React/TypeScript 前端项目

**主要内容**:

- TypeScript 最佳实践
- React 组件开发规范
- 状态管理策略
- 性能优化指南
- 测试规范

**使用示例**:

```bash
@frontend-rules.mdc
我需要创建一个响应式的产品列表组件
```

### 3. backend-rules.mdc - 后端开发规则

**适用场景**: Node.js/Python/Java 后端项目

**主要内容**:

- RESTful API 设计规范
- 微服务架构指南
- 错误处理标准
- 日志记录规范
- 安全最佳实践

**使用示例**:

```bash
@backend-rules.mdc
请设计一个用户认证 API，包含登录、注册和权限验证
```

### 4. database-rules.mdc - 数据库规则

**适用场景**: 数据库设计和查询优化

**主要内容**:

- 数据库设计规范
- 查询优化策略
- 分页实现（offset/limit）
- 数据迁移指南
- 性能监控

**使用示例**:

```bash
@database-rules.mdc
我需要设计一个电商系统的数据库架构，包含用户、商品、订单表
```

### 5. cloud-rules.mdc - 云服务规则

**适用场景**: AWS/Azure/GCP 云服务项目

**主要内容**:

- 云架构设计原则
- 服务选择指南
- 成本优化策略
- 安全配置标准
- 监控和告警

**使用示例**:

```bash
@cloud-rules.mdc
请设计一个基于 AWS 的微服务架构，包含负载均衡和自动扩缩容
```

### 6. bigcommerce-rules.mdc - BigCommerce 集成规则

**适用场景**: BigCommerce 电商平台开发

**主要内容**:

- BigDesign UI 组件库使用
- BigCommerce API 集成
- 主题开发规范
- 应用开发指南
- 性能优化

**使用示例**:

```bash
@bigcommerce-rules.mdc
我需要使用 BigDesign 创建一个产品详情页面，集成 BigCommerce API
```

### 7. bc-catalyst.mdc - BigCommerce Catalyst 开发规则

**适用场景**: BigCommerce Catalyst 应用开发

**主要内容**:

- Catalyst 应用架构设计
- React 组件开发规范
- 状态管理（Zustand）
- BigCommerce API 集成
- 性能优化和最佳实践
- 开发环境配置

**使用示例**:

```bash
@bc-catalyst.mdc
请帮我创建一个 Catalyst 应用的产品管理页面，包含产品列表和详情功能
```

### 8. deployment-rules.mdc - 部署规则

**适用场景**: CI/CD 和部署流程

**主要内容**:

- 部署策略选择
- 环境管理规范
- 自动化测试集成
- 回滚策略
- 监控和日志

**使用示例**:

```bash
@deployment-rules.mdc
请设计一个部署流程，包含自动化测试和健康检查
```

## 🎯 使用最佳实践 (Best Practices)

### 1. 选择合适的规则组合 (Choose Appropriate Rule Combinations)

#### 前端项目 (Frontend Projects)

```bash
@general-rules.mdc @frontend-rules.mdc
```

#### 后端 API 项目 (Backend API Projects)

```bash
@general-rules.mdc @backend-rules.mdc @database-rules.mdc
```

#### 全栈项目 (Full-Stack Projects)

```bash
@general-rules.mdc @frontend-rules.mdc @backend-rules.mdc @database-rules.mdc
```

#### BigCommerce 项目 (BigCommerce Projects)

```bash
@general-rules.mdc @frontend-rules.mdc @bigcommerce-rules.mdc @backend-rules.mdc
```

#### BigCommerce Catalyst 项目 (BigCommerce Catalyst Projects)

```bash
@general-rules.mdc @bc-catalyst.mdc @bigcommerce-rules.mdc
```

### 2. 提问技巧 (Question Techniques)

#### ✅ 好的提问方式 (Good Questions)

```bash
@general-rules.mdc @frontend-rules.mdc
请按照设计优先原则，帮我设计一个用户注册表单组件。
要求：
1. 使用 TypeScript 和 React Hooks
2. 包含表单验证
3. 响应式设计
4. 错误处理
```

#### ❌ 避免的提问方式 (Avoid These Questions)

```bash
帮我写个登录页面
```

（过于简单，缺乏具体要求和上下文）

### 3. 迭代开发流程 (Iterative Development Process)

1. **需求理解阶段**: 使用 `@general-rules.mdc` 确保理解需求
2. **设计阶段**: 结合相关技术规则进行架构设计
3. **实现阶段**: 按照规则进行代码实现
4. **测试阶段**: 遵循测试规范进行验证
5. **部署阶段**: 使用部署规则确保安全发布

## 🔧 团队协作指南 (Team Collaboration Guide)

### 1. 新成员入职 (New Member Onboarding)

1. **阅读 README.md**: 了解规则文件结构和使用方法
2. **熟悉通用规则**: 重点学习 `general-rules.mdc`
3. **选择专业规则**: 根据角色选择相应的技术规则
4. **实践练习**: 使用规则完成示例项目

### 2. 代码审查流程 (Code Review Process)

1. **规则检查**: 确保代码符合相关规则
2. **设计评审**: 验证架构设计合理性
3. **代码质量**: 检查代码风格和最佳实践
4. **测试覆盖**: 确保测试覆盖率达标
5. **安全审查**: 验证安全最佳实践

### 3. 项目启动流程 (Project Kickoff Process)

1. **需求分析**: 使用 `@general-rules.mdc` 进行需求梳理
2. **技术选型**: 根据项目特点选择合适的技术栈
3. **规则组合**: 确定需要使用的规则文件组合
4. **团队培训**: 确保团队成员熟悉相关规则
5. **工具配置**: 配置开发环境和 CI/CD 流程

## 🆘 常见问题 (FAQ)

### Q1: 如何选择合适的规则组合？

A1: 根据项目类型和技术栈选择：

- 纯前端项目：`@general-rules.mdc @frontend-rules.mdc`
- 后端 API：`@general-rules.mdc @backend-rules.mdc @database-rules.mdc`
- 全栈项目：组合所有相关规则

### Q2: 规则文件太多，如何快速找到需要的规则？

A2: 使用 README.md 中的规则文件详解部分，根据项目需求快速定位。

### Q3: 如何处理规则之间的冲突？

A3: 通用规则优先，技术规则补充。如有冲突，以更具体的规则为准。

### Q4: 新团队成员如何快速上手？

A4: 按照新成员入职流程，从通用规则开始，逐步学习专业规则。

### Q5: 如何更新和维护规则？

A5: 定期收集团队反馈，根据项目经验更新规则内容，确保规则与时俱进。

## 📞 支持与反馈 (Support & Feedback)

### 团队支持 (Team Support)

- 技术负责人：负责规则的技术准确性
- 组长：负责规则的执行和推广
- 开发同事：负责规则的验证和评估

### 反馈渠道 (Feedback Channels)

- 团队会议：定期讨论规则效果
- 代码审查：发现规则改进点
- 直接向本仓库提交 PR

## 📝 更新日志 (Changelog)

### v1.1.0 (2025-07-29)

- 新增 BigCommerce Catalyst 开发规则 (`bc-catalyst.mdc`)
- 迁移所有项目到 pnpm 包管理器
- 更新通用规则中的包管理器规范
- 优化部署规则中的 CI/CD 配置

### v1.0.0 (2025-07-15)

- 初始版本发布
- 包含 7 个核心规则文件
- 完整的团队协作指南
- 详细的使用说明和最佳实践

---

**注意**: 这些规则是团队协作的基础，请确保所有团队成员都熟悉并遵循这些规则。如有疑问或建议，请及时反馈给主维护人或者直接提交 PR。
