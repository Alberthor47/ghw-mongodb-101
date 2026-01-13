---
marp: true
theme: default
paginate: true
size: 16:9
title: MongoDB 101
footer: "MongoDB 101 | Major League Hacking"
---

<!-- _class: lead -->

# MongoDB 101
## Session 1 - Foundations & Document Model
**Facilitator:** Alberto Camarena  
**Presented at:** Global Hack Week 🌐 Beginners Week
**Date:** 12/01/26 📅

---

# Session 1 – Goals

By the end of this session you will be able to:

- Explain where MongoDB fits as an **operational database**

- Describe MongoDB’s **document model** and core concepts

- Understand **JSON** and **BSON** and how they relate to MongoDB documents

- Create a **MongoDB Atlas** cluster and connect with **Compass**

- Perform basic **insert** and **find** operations

---

# What is MongoDB?

- General-purpose **document database** 
- Stores data as **BSON documents** (JSON-like) in collections
- Designed for **operational, transactional** workloads:
    - Many concurrent reads and writes
    - Low-latency access
    - High availability and scalability
- Available as fully managed **MongoDB Atlas** across major clouds

---
# What Does MongoDB Offer?

- **Core database**
    - Flexible document model
    - Rich query language and aggregation framework
    - Indexes (single, compound, multikey, text, geospatial)
- **Specialized capabilities**
    - **Time series collections** for time-based data
    - **Atlas Search** (full-text search)
    - **Vector search** for semantic / AI use cases
    - **Change streams** for event-driven architectures
    - **Transactions** for multi-document ACID guarantees

---

# Database Landscape

- **Operational (OLTP) databases**
  - Back user-facing applications
  - Focus on many small, concurrent reads/writes
  - Require low latency and high availability

- **Analytical (OLAP) systems**
  - Power dashboards, BI, large aggregations
  - Focus on fewer, heavy queries over lots of data
  - Often batch-loaded from operational stores

---

# MongoDB as an Operational / Transactional DB

- MongoDB is primarily an **operational** database
  - Designed for application backends and systems of record
  - Supports high write throughput and low-latency queries
- **Transactional focus**
  - Single-document writes are **atomic**
  - Multi-document **ACID transactions** for cases where multiple updates must succeed or fail together
- Analytics are still important
  - Aggregation framework for **operational analytics**
  - Can integrate with dedicated analytics systems when needed

---

# MongoDB Core Concepts

- **Database**
  - Logical container for collections
- **Collection**
  - Group of related documents (similar to a table)
- **Document**
  - JSON-like object with fields and values
- **Field**
  - Key in a document, e.g. `name`, `price`, `address.city`

---

# The Document Model

- Data is stored as **documents**, not rows

- Documents often contain **related data together**
  - Embedded objects
  - Arrays of values or sub-documents

- Schema is **flexible**
  - Different documents in a collection can have different fields
  - Application code and validation rules control structure

---

# Quick JSON Recap

**JSON (JavaScript Object Notation)**

- Text format for structured data

- Basic types:
  - `string`, `number`, `boolean`, `null`
  - `object` (key–value pairs)
  - `array` (ordered list of values)

- Human-readable and widely supported across languages

---

# JSON Example

```json
{
  "name": "Ada Lovelace",
  "age": 36,
  "email": "ada@example.com",
  "isActive": true,
  "tags": ["vip", "beta"],
  "address": {
    "street": "123 Baker St",
    "city": "London",
    "country": "UK"
  }
}
```

- This is conceptually similar to a MongoDB document

---

# JSON in MongoDB

- When you insert data via drivers or shell, you typically write **JSON-like** objects

- Queries and updates also use JSON-like syntax

- Easy mental model: “documents are JSON objects in collections”

- Under the hood, MongoDB uses **BSON**, not plain JSON

---

# What is BSON?

**BSON (Binary JSON)**

- Binary-encoded serialization format used by MongoDB

- Inspired by JSON, but with:
  - Extra data types
  - Efficient binary representation
  - Fast traversal and encoding/decoding

- What gets stored on disk and sent over the network

---

# BSON vs JSON – Data Types

JSON types:

- `string`, `number`, `boolean`, `null`, `object`, `array`

BSON adds important types, for example:

- `ObjectId` – default type for `\_id`
- `Date` – millisecond precision timestamp
- `Decimal128` – high-precision decimal
- `Binary` – arbitrary binary data
- `Int32`, `Int64`, `Double` – numeric distinctions

These extra types make MongoDB better suited for real-world applications.

---

# BSON vs JSON – Representation

- In drivers and tools, BSON types are often shown with **Extended JSON** syntax

Examples:

```json
{ "_id": { "$oid": "64e4c7f93f4f0b2a4c123456" } }

{ "createdAt": { "$date": "2024-08-20T12:34:56.789Z" } }

{ "price": { "$numberDecimal": "19.99" } }
```

- Internally stored as efficient binary, but exposed in a JSON-like way

---

# Why BSON Matters for Operational Workloads

- **Efficient encoding**
  - Faster to parse and traverse than raw text JSON
  - Important for high-throughput, low-latency operations
- **Richer types**
  - Dates, decimals, and binary data are first-class citizens
  - Reduces workarounds in application code
- **Indexing and queries**
  - Indexes are built over BSON fields and types
  - Type information helps optimize queries

---

# Documents, Types, and Queries

- Each field has a **BSON type**
  - Types matter in comparisons and sorting
  - Avoid mixing incompatible types in a single field (e.g. string and number)

- Good practice:
  - Be consistent with types across documents
  - Use appropriate types (e.g. `Date` for timestamps, `Decimal128` for money)

---

# Atlas Cluster Setup

**Goal**

- Create a MongoDB Atlas cluster ready for the rest of the workshop

**High-level steps**

- Sign in or sign up for MongoDB Atlas
- Create a new project (optional but recommended)
- Provision a free-tier cluster
- Create a database user (username + password)
- Add your client IP to the network access list
- Wait for the cluster to become available

---

# Tools Overview

We will mainly use:

- **MongoDB Atlas UI**
  - Manage cluster, security, sample data, basic queries

- **MongoDB Compass**
  - Graphical UI for browsing data and running queries

- **MongoDB Shell (`mongosh`)** (optional)
  - Command-line interface for interactive work

Participants can follow with Compass and Atlas UI; `mongosh` is optional.

---

# Connect with Compass

**Goal**

- Connect Compass to your Atlas cluster

**High-level steps**

- Open Atlas and navigate to your cluster

- Choose the “Connect with MongoDB Compass” option

- Copy the provided connection string

- Paste into Compass and set your username/password

- Connect and verify you can see system and sample databases

---

# Collections and Documents in Practice

- In Compass, you can:

  - View databases and collections in the left sidebar

  - Click a collection to see documents

  - Switch between tree and JSON views

- Observe:

  - The `\_id` field on each document

  - Different field sets across documents in the same collection

---

# CRUD Basics

CRUD = **Create, Read, Update, Delete**

In this session:

- Focus on **Create** (insert) and **Read** (find)

In later sessions:

- We’ll cover **Update** and **Delete**, plus more advanced querying and aggregation

---

# Create: Insert Documents

Common operations:

- `insertOne(document)`

- `insertMany([document1, document2, ...])`

---

Examples (shell-style):

```javascript
db.customers.insertOne({
  name: "Ada Lovelace",
  email: "ada@example.com",
  isActive: true,
  tags: ["vip", "beta"],
  address: { city: "London", country: "UK" }
})

db.customers.insertMany([
  { name: "Grace Hopper", email: "grace@example.com" },
  { name: "Alan Turing", email: "alan@example.com" }
])
```

---

# Insert Documents

**Suggested exercise**

- Create a `customers` (or similar) collection
- Insert several documents that include:
  - Strings, numbers, booleans
  - An embedded `address` document
  - A `tags` array
- Try inserting via:
  - Compass “Insert Document” UI
  - `mongosh` (if available)

---

# Read: Find Documents

Common operations:

- `findOne(filter)` – returns a single document
- `find(filter)` – returns a cursor over matching documents

Basic examples:

```javascript
// All documents
db.customers.find({})

// Equality match
db.customers.find({ "address.country": "UK" })

// Match an array value
db.customers.find({ tags: "vip" })
```

---

# Basic Queries

- Retrieve data using simple filters

**Suggested exercise**

- Find all customers from a specific country

- Find customers with a certain tag

- Combine conditions on multiple fields

- Explore:
  - Filter bar and query history in Compass
  - JSON view vs tree view of results

---

# Session 1 Summary

Today you:

- Positioned MongoDB as an **operational, transactional** database
- Learned core MongoDB concepts:
  - Databases, collections, documents, fields, `\_id`
- Explored **JSON** and **BSON**:
  - JSON as the familiar representation
  - BSON as the efficient, typed storage format
- Set up an Atlas cluster and connected with Compass
- Performed basic **insert** and **find** operations

---

# Next Steps

In Session 2, we will:

- Go deeper into CRUD with updates, replaces, and deletes

- Learn how to shape query results using projection, sort, limit, and count

- Build our first aggregation pipelines to summarize and analyze data

- Apply these concepts using the cluster and collections you created in Session 1

---

# Thank You!
## Questions?

References and Further Reading:
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB University Free Courses](https://university.mongodb.com/)
- [This Workshop's GitHub Repository](https://github.com/Alberthor47/ghw-mongodb-101.git)