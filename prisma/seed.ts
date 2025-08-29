import { db } from "../src/lib/db"
import bcrypt from "bcryptjs"
import { UserRole, OrderType, OrderStatus, PaymentStatus } from "@prisma/client"

async function main() {
  // Create Super Admin
  const hashedPassword = await bcrypt.hash("superadmin123", 10)
  
  const superAdmin = await db.user.create({
    data: {
      email: "superadmin@qrrestaurant.com",
      name: "Super Admin",
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      phone: "+8801234567890",
      active: true
    }
  })

  console.log("Super Admin created:", superAdmin.email)

  // Create a sample restaurant
  const restaurant = await db.restaurant.create({
    data: {
      name: "Sample Restaurant",
      description: "A modern QR code-based restaurant in Dhaka",
      address: "123 Gulshan Avenue, Dhaka 1212",
      phone: "+8801234567890",
      email: "info@samplrestaurant.com",
      website: "https://samplrestaurant.com",
      active: true,
      ownerId: superAdmin.id
    }
  })

  console.log("Restaurant created:", restaurant.name)

  // Create sample branches
  const branch1 = await db.branch.create({
    data: {
      name: "Gulshan Branch",
      description: "Main branch in Gulshan area",
      address: "123 Gulshan Avenue, Dhaka 1212",
      phone: "+8801234567891",
      email: "gulshan@samplrestaurant.com",
      latitude: 23.7804,
      longitude: 90.4193,
      active: true,
      restaurantId: restaurant.id
    }
  })

  const branch2 = await db.branch.create({
    data: {
      name: "Dhanmondi Branch",
      description: "Branch in Dhanmondi area",
      address: "456 Dhanmondi Road, Dhaka 1209",
      phone: "+8801234567892",
      email: "dhanmondi@samplrestaurant.com",
      latitude: 23.7465,
      longitude: 90.3749,
      active: true,
      restaurantId: restaurant.id
    }
  })

  console.log("Branches created:", branch1.name, branch2.name)

  // Create sample categories
  const categories = await Promise.all([
    db.category.create({
      data: {
        name: "Appetizers",
        description: "Start your meal with these delicious appetizers",
        sortOrder: 1,
        active: true,
        restaurantId: restaurant.id
      }
    }),
    db.category.create({
      data: {
        name: "Main Course",
        description: "Hearty main courses for your satisfaction",
        sortOrder: 2,
        active: true,
        restaurantId: restaurant.id
      }
    }),
    db.category.create({
      data: {
        name: "Desserts",
        description: "Sweet endings to your meal",
        sortOrder: 3,
        active: true,
        restaurantId: restaurant.id
      }
    }),
    db.category.create({
      data: {
        name: "Beverages",
        description: "Refreshing drinks and beverages",
        sortOrder: 4,
        active: true,
        restaurantId: restaurant.id
      }
    })
  ])

  console.log("Categories created:", categories.map(c => c.name))

  // Create sample menu items
  const menuItems = await Promise.all([
    // Appetizers
    db.menuItem.create({
      data: {
        name: "Spring Rolls",
        description: "Crispy vegetable spring rolls with sweet chili sauce",
        price: 180,
        vegetarian: true,
        available: true,
        sortOrder: 1,
        categoryId: categories[0].id
      }
    }),
    db.menuItem.create({
      data: {
        name: "Chicken Wings",
        description: "Spicy chicken wings served with ranch dip",
        price: 250,
        vegetarian: false,
        available: true,
        sortOrder: 2,
        categoryId: categories[0].id
      }
    }),
    // Main Course
    db.menuItem.create({
      data: {
        name: "Chicken Biryani",
        description: "Fragrant basmati rice with tender chicken and aromatic spices",
        price: 350,
        vegetarian: false,
        available: true,
        sortOrder: 1,
        categoryId: categories[1].id
      }
    }),
    db.menuItem.create({
      data: {
        name: "Vegetable Curry",
        description: "Mixed vegetables in rich curry sauce",
        price: 280,
        vegetarian: true,
        available: true,
        sortOrder: 2,
        categoryId: categories[1].id
      }
    }),
    db.menuItem.create({
      data: {
        name: "Grilled Fish",
        description: "Fresh grilled fish with herbs and lemon",
        price: 450,
        vegetarian: false,
        available: true,
        sortOrder: 3,
        categoryId: categories[1].id
      }
    }),
    // Desserts
    db.menuItem.create({
      data: {
        name: "Gulab Jamun",
        description: "Traditional sweet milk dumplings in sugar syrup",
        price: 120,
        vegetarian: true,
        available: true,
        sortOrder: 1,
        categoryId: categories[2].id
      }
    }),
    db.menuItem.create({
      data: {
        name: "Ice Cream",
        description: "Vanilla ice cream with chocolate sauce",
        price: 150,
        vegetarian: true,
        available: true,
        sortOrder: 2,
        categoryId: categories[2].id
      }
    }),
    // Beverages
    db.menuItem.create({
      data: {
        name: "Fresh Lime Soda",
        description: "Refreshing lime soda with mint",
        price: 100,
        vegetarian: true,
        available: true,
        sortOrder: 1,
        categoryId: categories[3].id
      }
    }),
    db.menuItem.create({
      data: {
        name: "Mango Lassi",
        description: "Traditional yogurt drink with mango",
        price: 120,
        vegetarian: true,
        available: true,
        sortOrder: 2,
        categoryId: categories[3].id
      }
    })
  ])

  console.log("Menu items created:", menuItems.length)

  // Create sample tables for each branch
  const tables1 = await Promise.all(
    Array.from({ length: 10 }, (_, i) => 
      db.table.create({
        data: {
          number: i + 1,
          capacity: 4,
          qrCode: `qr-table-${branch1.id}-${i + 1}`,
          active: true,
          branchId: branch1.id
        }
      })
    )
  )

  const tables2 = await Promise.all(
    Array.from({ length: 8 }, (_, i) => 
      db.table.create({
        data: {
          number: i + 1,
          capacity: 4,
          qrCode: `qr-table-${branch2.id}-${i + 1}`,
          active: true,
          branchId: branch2.id
        }
      })
    )
  )

  console.log("Tables created:", tables1.length + tables2.length)

  // Create sample menu and link to branches
  const menu = await db.menu.create({
    data: {
      name: "Standard Menu",
      description: "Our standard menu with all items",
      active: true,
      restaurantId: restaurant.id
    }
  })

  // Link menu items to menu
  for (const menuItem of menuItems) {
    await db.menuItem.update({
      where: { id: menuItem.id },
      data: { menus: { connect: { id: menu.id } } }
    })
  }

  // Link menu to branches
  await Promise.all([
    db.branchMenu.create({
      data: {
        branchId: branch1.id,
        menuId: menu.id,
        active: true
      }
    }),
    db.branchMenu.create({
      data: {
        branchId: branch2.id,
        menuId: menu.id,
        active: true
      }
    })
  ])

  console.log("Database seeded successfully!")
  console.log("\n=== SUPER ADMIN CREDENTIALS ===")
  console.log("Email: superadmin@qrrestaurant.com")
  console.log("Password: superadmin123")
  console.log("Role: SUPER_ADMIN")
  console.log("\nYou can now log in at: /auth/signin")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })