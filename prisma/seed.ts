import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, addHours, subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  await prisma.familyNote.deleteMany();
  await prisma.todoItem.deleteMany();
  await prisma.shoppingItem.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.household.deleteMany();

  const household = await prisma.household.create({
    data: {
      name: "Family Hub Demo",
    },
  });

  const passwordHash = await bcrypt.hash("familyhub123", 10);

  const alex = await prisma.user.create({
    data: {
      householdId: household.id,
      name: "Alex",
      email: "alex@example.com",
      passwordHash,
      role: "ADMIN",
      color: "#2563eb",
    },
  });

  const jamie = await prisma.user.create({
    data: {
      householdId: household.id,
      name: "Jamie",
      email: "jamie@example.com",
      passwordHash,
      role: "MEMBER",
      color: "#16a34a",
    },
  });

  const groceries = await prisma.category.create({
    data: {
      householdId: household.id,
      name: "Groceries",
      type: "SHOPPING",
      color: "#22c55e",
    },
  });

  const chores = await prisma.category.create({
    data: {
      householdId: household.id,
      name: "Chores",
      type: "TODO",
      color: "#f59e0b",
    },
  });

  const family = await prisma.category.create({
    data: {
      householdId: household.id,
      name: "Family",
      type: "CALENDAR",
      color: "#8b5cf6",
    },
  });

  await prisma.shoppingItem.createMany({
    data: [
      {
        householdId: household.id,
        name: "Milk",
        quantity: "2",
        status: "ACTIVE",
        addedById: alex.id,
        categoryId: groceries.id,
      },
      {
        householdId: household.id,
        name: "Bananas",
        quantity: "6",
        status: "ACTIVE",
        addedById: jamie.id,
        categoryId: groceries.id,
      },
      {
        householdId: household.id,
        name: "Dishwasher tabs",
        status: "DONE",
        addedById: alex.id,
        completedAt: new Date(),
        categoryId: groceries.id,
      },
    ],
  });

  await prisma.todoItem.createMany({
    data: [
      {
        householdId: household.id,
        title: "Take recycling out",
        priority: "HIGH",
        status: "OPEN",
        dueAt: addHours(new Date(), 6),
        createdById: alex.id,
        assignedToId: jamie.id,
        categoryId: chores.id,
      },
      {
        householdId: household.id,
        title: "Pay school form",
        priority: "MEDIUM",
        status: "OPEN",
        dueAt: subDays(new Date(), 1),
        createdById: jamie.id,
        assignedToId: alex.id,
        categoryId: chores.id,
      },
    ],
  });

  await prisma.calendarEvent.createMany({
    data: [
      {
        householdId: household.id,
        title: "School pickup",
        startAt: addHours(new Date(), 3),
        allDay: false,
        createdById: alex.id,
        assignedToId: jamie.id,
        categoryId: family.id,
      },
      {
        householdId: household.id,
        title: "Grandma visit",
        startAt: addDays(new Date(), 2),
        allDay: true,
        createdById: jamie.id,
        categoryId: family.id,
      },
    ],
  });

  await prisma.familyNote.create({
    data: {
      householdId: household.id,
      title: "Weekend reminder",
      content: "Remember to bring the picnic blanket and refill the water bottles.",
      pinned: true,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
