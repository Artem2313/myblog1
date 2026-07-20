import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { slugify } from "../lib/slug";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

const samplePosts = [
  {
    title: "Welcome to the Blog",
    content:
      "This is the first post of the refactored blog. It demonstrates server components, ISR and a clean layered architecture.",
    published: true,
  },
  {
    title: "Why Server Components Matter",
    content:
      "Server components let us keep data access on the server, ship less JavaScript and simplify state management.",
    published: true,
  },
  {
    title: "Understanding Incremental Static Regeneration",
    content:
      "ISR lets us serve prerendered pages and refresh them in the background on a fixed interval, combining speed with freshness.",
    published: true,
  },
  {
    title: "A Primer on Role-Based Access Control",
    content:
      "RBAC assigns permissions to roles instead of individual users. This blog uses two roles: USER and ADMIN.",
    published: true,
  },
  {
    title: "Hashing Passwords with bcrypt",
    content:
      "Passwords are never stored in plain text. bcrypt applies a salted, adaptive hash that stays slow for attackers.",
    published: true,
  },
  {
    title: "Stateless Sessions with JWT",
    content:
      "The session token is a signed JWT stored in an HttpOnly cookie. The server verifies the signature on every request.",
    published: true,
  },
  {
    title: "Validating Input with Zod",
    content:
      "Every form submission is validated on the server with Zod schemas before any database call happens.",
    published: true,
  },
  {
    title: "Pagination Strategies",
    content:
      "The post listing paginates through path segments so every page can be prerendered and revalidated independently.",
    published: true,
  },
  {
    title: "Composing UI from Small Components",
    content:
      "Small focused components keep the UI easy to reason about and reuse across pages.",
    published: true,
  },
  {
    title: "The Repository Pattern",
    content:
      "Repositories isolate database queries from business logic, which keeps services testable and the ORM swappable.",
    published: true,
  },
  {
    title: "Draft: Upcoming Features",
    content: "This draft is only visible to its author and to admins.",
    published: false,
  },
];

async function main() {
  const [adminPassword, userPassword] = await Promise.all([
    bcrypt.hash("Admin123!", SALT_ROUNDS),
    bcrypt.hash("User1234!", SALT_ROUNDS),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "Alice",
      email: "alice@example.com",
      password: userPassword,
      role: "USER",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      name: "Bob",
      email: "bob@example.com",
      password: userPassword,
      role: "USER",
    },
  });

  const authors = [admin, alice, bob];

  for (const [index, post] of samplePosts.entries()) {
    const slug = slugify(post.title);
    await prisma.post.upsert({
      where: { slug },
      update: {},
      create: {
        ...post,
        slug,
        authorId: authors[index % authors.length].id,
      },
    });
  }

  console.log("Seeded 3 users and", samplePosts.length, "posts.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
