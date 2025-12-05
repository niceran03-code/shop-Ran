# E-commerce Admin System (NestJS + Prisma + PostgreSQL + React Admin)

## Overview

This project is an **e-commerce admin management system**, consisting of:

- **Backend**: NestJS, Prisma ORM, PostgreSQL
- **Frontend**: React, React Router, Ant Design

It provides essential admin functionalities including user authentication, product management, and category management.

![status](https://img.shields.io/badge/status-in%20development-yellow)

> **Work in Progress — This project is actively being developed.**

---

# Features

## User Features

- User registration
- User login
- JWT-based authentication
- Secure password hashing via bcrypt

---

## Product Features

- Create product
- Product list (active / inactive)
- View product details
- Update product
- Delete product

---

## Category Features

- Create category
- Category list (supports parent / child categories)
- Edit category
- Delete category

---

## Admin Frontend Features

- Registration page
- Login page
- Product management pages (list, create, edit)
- Category management pages
- Navigation using React Router
- API calls handled with Axios
- UI layout built with Ant Design

---

# Database Schema

## User Table

| Field     | Type     | Description        |
| --------- | -------- | ------------------ |
| id        | Int, PK  | User ID            |
| username  | String   | Unique username    |
| password  | String   | Hashed password    |
| email     | String   | User email         |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp   |

---

## Category Table

| Field     | Type     | Description                |
| --------- | -------- | -------------------------- |
| id        | Int, PK  | Category ID                |
| name      | String   | Category name              |
| parentId  | Int?     | Parent category (nullable) |
| createdAt | DateTime | Creation timestamp         |
| updatedAt | DateTime | Update timestamp           |

---

## Product Table

| Field       | Type     | Description                      |
| ----------- | -------- | -------------------------------- |
| id          | Int, PK  | Product ID                       |
| name        | String   | Product name                     |
| price       | Float    | Product price                    |
| stock       | Int      | Stock quantity                   |
| isActive    | Boolean  | Product status (active/inactive) |
| description | String?  | Product description (optional)   |
| userId      | Int      | User who created the product     |
| categoryId  | Int      | Category ID                      |
| createdAt   | DateTime | Creation timestamp               |
| updatedAt   | DateTime | Update timestamp                 |

# Backend Setup (NestJS)

## Installation

```bash
pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
