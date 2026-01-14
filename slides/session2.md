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
## Session 2 - CRUD Deep Dive & Aggregation
**Facilitator:** Alberto Camarena  
**Presented at:** Global Hack Week 🌐 Beginners Week
**Date:** 13/01/26 📅

---

# Session 2 – Goals

By the end of this session you will be able to:

- Perform **update**, **replace**, and **delete** operations safely

- Use **comparison** and **logical** operators to design effective queries

- **Shape query results** using projection, sort, limit, and counts

- Build basic **aggregation pipelines** to summarize and analyze data

---

# Recap

You should now be comfortable with:

- MongoDB as an **operational, transactional** database
- Core concepts:
  - Databases, collections, documents, fields
- **JSON** vs **BSON** and common BSON types
- Getting started with **MongoDB Atlas** and **Compass**

---

# Setup Check

Before continuing, verify that:

- You can connect to your **Atlas** cluster

- You have at least one working collection, for example:
  - A `customers` collection you created
  - Or a sample dataset provided in Atlas

If something is not working, fix it now so you can follow the hands-on parts.

---

# CRUD Deep Dive

In this section:

- Update existing documents

- Replace entire documents

- Delete documents safely

We will still think in terms of **operational** workloads:
small, frequent changes on live application data.

---

# Updating Documents – Concepts

Key methods:

- `updateOne(filter, update, options)`
- `updateMany(filter, update, options)`
- `replaceOne(filter, replacement, options)`

Important ideas:

- **Filter** selects the documents to modify

- **Update document** uses update operators (e.g. `$set`, `$inc`)

- With `replaceOne`, the replacement is a full document (no operators)

---

# Common Update Operators

- `$set` – set or overwrite a field value

- `$unset` – remove a field

- `$inc` – increment or decrement a numeric field

- `$push` – append a value to an array

- `$pull` – remove matching elements from an array

- `$addToSet` – add to array only if the value is not already present

---

# Update Examples

```javascript
// Set a field
db.customers.updateOne(
  { email: "ada@example.com" },
  { $set: { status: "active" } }
)
// Increment a numeric field
db.customers.updateOne(
  { email: "ada@example.com" },
  { $inc: { loyaltyPoints: 10 } }
)
// Add a tag if not present
db.customers.updateOne(
  { email: "ada@example.com" },
  { $addToSet: { tags: "vip" } }
)
```

---

# Replace Example

```javascript
db.customers.replaceOne(
  { email: "ada@example.com" },
  {
    name: "Ada Lovelace",
    email: "ada@example.com",
    status: "vip",
    loyaltyPoints: 100,
    address: { city: "London", country: "UK" }
  }
)
```

Notes:

- The replacement document becomes the new document
- Any fields not included are effectively removed

---

# Deleting Documents – Concepts

Key methods:

- `deleteOne(filter)`

- `deleteMany(filter)`

Good practices:

- Always verify your **filter** with a `find()` first

- Prefer `deleteOne` when you expect a single match

- Be explicit and careful with broad filters in `deleteMany`

---

# Delete Examples

```javascript
// Delete a single test customer
db.customers.deleteOne({ email: "test@example.com" })

// Delete all inactive customers
db.customers.deleteMany({ status: "inactive" })
```

---

# Designing Better Queries

So far we used simple equality filters.

Next:

- Use **comparison** and **logical** operators

- Write more expressive queries against operational data

This helps model realistic application queries and APIs.

---

# Comparison Operators

Operators:

- `$gt` – greater than

- `$gte` – greater than or equal

- `$lt` – less than

- `$lte` – less than or equal

---

Examples:

```javascript
// Loyalty points strictly greater than 50
db.customers.find({ loyaltyPoints: { $gt: 50 } })

// Age between 18 and 30 (inclusive)
db.customers.find({
  age: { $gte: 18, $lte: 30 }
})
```

---

# Logical Operators

Operators:

- `$and` – all conditions must be true

- `$or` – at least one condition must be true

---

Examples:

```javascript
// Active customers in the UK
db.customers.find({
  $and: [
    { status: "active" },
    { "address.country": "UK" }
  ]
})

// Customers in UK or USA
db.customers.find({
  $or: [
    { "address.country": "UK" },
    { "address.country": "USA" }
  ]
})
```

---

# Arrays in Queries

Arrays are first-class in MongoDB.

Simple equality on arrays:

- A scalar value matches elements inside the array.

Example:

```javascript
// Any customer whose tags array contains "vip"
db.customers.find({ tags: "vip" })
```

Other useful operators (if you want to mention them):

- `$in`, `$nin`, `$all` for more advanced array matching

---

# Modifying Query Results

Sometimes we do not need all fields or all documents.

Key techniques:

- **Projection** – choose which fields to include or exclude

- **Sorting** – order results by one or more fields

- **Limiting** – restrict how many documents are returned

- **Counting** – see how many documents match a filter

---

# Projection

Projection lets you control which fields are returned.

Example:

```javascript
// Only name and email, hide _id
db.customers.find(
  { status: "active" },
  { name: 1, email: 1, _id: 0 }
)
```

Notes:

- `1` means include field, `0` means exclude

- `_id` is included by default unless explicitly excluded

---

# Sort and Limit

Examples:

```javascript
// Sort by loyaltyPoints descending
db.customers.find({}).sort({ loyaltyPoints: -1 })

// Top 5 customers by loyaltyPoints
db.customers.find({})
  .sort({ loyaltyPoints: -1 })
  .limit(5)
```

- `1` = ascending

- `-1` = descending

---

# Counting Documents

Examples:

```javascript
// Count all active customers
db.customers.countDocuments({ status: "active" })

// Count customers with more than 100 points
db.customers.countDocuments({ loyaltyPoints: { $gt: 100 } })
```

This is useful for dashboards, pagination, and monitoring.

---

# Intro to Aggregation

Sometimes you need to:

- Group data

- Compute totals and averages

- Transform documents before returning them

MongoDB provides the **aggregation framework**:

- A pipeline of **stages**

- Each stage takes input documents and outputs transformed documents

---

# Aggregation Pipeline Basics

Common stages:

- `$match` – filter documents

- `$project` – reshape documents

- `$group` – group documents and compute aggregates

- `$sort` – order results

- `$limit` – restrict number of results

- `$count` – count documents in the pipeline

We will focus on simple pipelines built from these stages.

---

# Aggregation – Example 1

Count customers per country:

```javascript
db.customers.aggregate([
  { $match: { status: "active" } },
  {
    $group: {
      _id: "$address.country",
      totalCustomers: { $sum: 1 }
    }
  },
  { $sort: { totalCustomers: -1 } }
])
```

---

# Aggregation – Example 2

Average loyalty points per status:

```javascript
db.customers.aggregate([
  {
    $group: {
      _id: "$status",
      avgPoints: { $avg: "$loyaltyPoints" }
    }
  },
  { $sort: { avgPoints: -1 } }
])
```

---

# Aggregation – Using Compass

Compass has a visual Aggregations tab:

- Build a pipeline stage by stage

- See intermediate results for each stage

- Export or save pipelines for reuse

We will use Compass for hands-on aggregation to reduce setup friction.

---

# Session 2 - Summary

Today you:

- Went deeper into **CRUD**:
  - Updated, replaced, and deleted documents

- Designed more expressive queries using:
  - Comparison and logical operators

- Learned how to **shape query results** with:
  - Projection, sort, limit, and counts

- Built your first **aggregation pipelines** to summarize operational data

---

# Next Steps – Looking Ahead to Session 3

In Session 3, we will:

- Explore **indexes** and compare performance with and without them

- Discuss **data modeling** patterns for operational workloads

- Introduce **transactions** and when to use them

---

# Thank You!
## Questions?

References and Further Reading:
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB University Free Courses](https://university.mongodb.com/)
- [This Workshop's GitHub Repository](https://github.com/Alberthor47/ghw-mongodb-101.git)