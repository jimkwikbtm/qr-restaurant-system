# QR Restaurant Management System

A modern, comprehensive QR code-based restaurant management system built with Next.js, designed for multi-branch restaurants in Bangladesh.

## 🚀 Features

### Core Features
- **Multi-Branch Support**: Manage multiple restaurant branches from a single system
- **QR Code Ordering**: Customers can scan QR codes at tables to order directly
- **Role-Based Access Control**: Different access levels for various staff roles
- **Three Order Types**: Dine-in, Takeaway, and Delivery
- **Real-time Menu Management**: Dynamic menu with categories and items
- **Order Management**: Complete order tracking and status updates

### User Roles
- **Super Admin**: Complete system access, manages restaurants and settings
- **Restaurant Owner**: Manages their restaurant and branches
- **Manager**: Oversees multiple branches
- **Branch Manager**: Manages specific branch operations
- **Chef**: Views and updates order status in kitchen
- **Waiter**: Takes orders and manages tables
- **Staff**: Basic access for restaurant operations

### Technical Features
- **Modern Tech Stack**: Next.js 15, TypeScript, Prisma, Tailwind CSS
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Live order status updates
- **Secure Authentication**: NextAuth.js with role-based access
- **Database**: SQLite (easily upgradeable to PostgreSQL)
- **Add-on System**: Extensible architecture for additional features
- **Theme System**: Customizable designs and styles

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui Components
- **Authentication**: NextAuth.js v4
- **Database**: Prisma ORM with SQLite
- **State Management**: Zustand, TanStack Query
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Deployment**: Vercel (serverless)

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/your-username/qr-restaurant-system.git
cd qr-restaurant-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your values
```

4. **Set up the database**
```bash
npm run db:setup
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:3000`

## 🔐 Default Login Credentials

### Super Admin
- **Email**: `superadmin@qrrestaurant.com`
- **Password**: `superadmin123`
- **Access**: Complete system administration

### Access URLs
- **Homepage**: `http://localhost:3000`
- **Login**: `http://localhost:3000/auth/signin`
- **Super Admin Dashboard**: `http://localhost:3000/admin/super`

## 🚀 Deployment

### Vercel Deployment

For detailed deployment instructions, see [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

Quick steps:
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Environment Variables
```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="https://your-app-name.vercel.app"
```

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboards
│   ├── table/             # QR code table pages
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Database connection
│   ├── rbac.ts          # Role-based access control
│   └── utils.ts         # Utility functions
├── types/               # TypeScript type definitions
└── prisma/              # Database schema and migrations
```

## 🎯 Key Features in Detail

### 1. QR Code System
- Generate unique QR codes for each table
- Customers scan to access menu and order
- No app download required
- Works with any smartphone camera

### 2. Multi-Branch Management
- Centralized restaurant management
- Individual branch settings
- Branch-specific menus and pricing
- Unified order tracking across branches

### 3. Role-Based Access
- Granular permission system
- Role-specific dashboards
- Secure access control
- Audit trail for all actions

### 4. Order Management
- Real-time order tracking
- Multiple order status updates
- Kitchen display system
- Customer notifications

### 5. Menu Management
- Dynamic menu categories
- Real-time availability updates
- Image upload support
- Pricing management

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with sample data
npm run db:setup     # Complete database setup
```

## 🎨 Customization

### Themes
The system supports customizable themes:
- Color scheme customization
- Layout variations
- Brand-specific styling
- Mobile-responsive designs

### Add-ons
Extensible architecture for additional features:
- Payment gateway integrations
- Advanced analytics
- Customer loyalty programs
- Inventory management
- Staff scheduling

## 📱 Mobile Responsiveness

- **Mobile-first design**: Optimized for smartphones
- **Tablet support**: Full functionality on tablets
- **Desktop experience**: Enhanced features for larger screens
- **Progressive Web App**: Can be installed on devices

## 🔒 Security Features

- **Secure Authentication**: NextAuth.js with session management
- **Role-Based Access**: Granular permission system
- **Input Validation**: Comprehensive form validation
- **CSRF Protection**: Built-in CSRF protection
- **Secure Headers**: Proper security headers

## 📊 Analytics & Reporting

- **Sales Analytics**: Revenue and order trends
- **Customer Analytics**: Ordering patterns and preferences
- **Menu Performance**: Popular items and categories
- **Staff Performance**: Service metrics and efficiency

## 🌐 Multi-Language Support

Ready for internationalization:
- Bengali (Bangladesh)
- English
- Easy to add more languages
- RTL language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the deployment guide
- Review the documentation
- Contact the development team

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic QR code ordering system
- ✅ Multi-branch support
- ✅ Role-based access control
- ✅ Three order types

### Phase 2 (Upcoming)
- 🔄 Payment gateway integration
- 🔄 Mobile app development
- 🔄 Advanced analytics
- 🔄 Customer loyalty program

### Phase 3 (Future)
- 📋 Inventory management
- 📋 Staff scheduling
- 📋 Advanced reporting
- 📋 API for third-party integrations

---

Built with ❤️ for the restaurant industry in Bangladesh