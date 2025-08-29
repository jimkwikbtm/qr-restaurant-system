# QR Restaurant Management System - Vercel Deployment Guide

## Step-by-Step Deployment Instructions

### Prerequisites
1. **GitHub Account**: You need a GitHub account to connect with Vercel
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **Node.js**: Installed on your local machine (v18 or higher)

### Step 1: Prepare Your Project for Deployment

#### 1.1 Update Environment Variables
Create a `.env.local` file for Vercel deployment:

```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here-change-this-in-production"
NEXTAUTH_URL="https://your-app-name.vercel.app"

# Generate a secure secret for NEXTAUTH_SECRET:
# Run: openssl rand -base64 32
```

#### 1.2 Update Database Configuration for Vercel
Since Vercel is serverless, we need to modify the database setup:

```typescript
// In prisma/schema.prisma, update the datasource:
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

#### 1.3 Create Vercel Configuration
Create `vercel.json` in your project root:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "NEXTAUTH_URL": "@nextauth_url",
    "DATABASE_URL": "@database_url"
  }
}
```

### Step 2: Push to GitHub

#### 2.1 Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit - QR Restaurant Management System"
```

#### 2.2 Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it `qr-restaurant-system`
4. Click "Create repository"

#### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/your-username/qr-restaurant-system.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

#### 3.1 Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Select your GitHub repository (`qr-restaurant-system`)
4. Click "Import"

#### 3.2 Configure Environment Variables
In the Vercel project settings, add these environment variables:

```
NEXTAUTH_SECRET=your-super-secret-key-here-change-this-in-production
NEXTAUTH_URL=https://your-app-name.vercel.app
DATABASE_URL=file:./dev.db
```

#### 3.3 Configure Build Settings
Vercel will automatically detect Next.js and use these settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### 3.4 Deploy
Click "Deploy" to start the deployment process.

### Step 4: Post-Deployment Setup

#### 4.1 Set Up Database
Since we're using SQLite, we need to initialize the database:

1. **Connect to Vercel via CLI**:
```bash
npm i -g vercel
vercel login
```

2. **Run database setup**:
```bash
vercel env pull .env.production
npm run db:setup
```

#### 4.2 Access Your Application
Your application will be available at: `https://your-app-name.vercel.app`

### Step 5: Test the Application

#### 5.1 Access the Homepage
Visit your deployed URL to see the restaurant homepage.

#### 5.2 Test QR Code Functionality
1. Navigate to any table page: `https://your-app-name.vercel.app/table/qr-table-branchId-tableNumber`
2. Test the ordering system

#### 5.3 Test Admin Panel
1. Go to: `https://your-app-name.vercel.app/auth/signin`
2. Use super admin credentials:
   - **Email**: `superadmin@qrrestaurant.com`
   - **Password**: `superadmin123`

### Step 6: Custom Domain (Optional)

#### 6.1 Add Custom Domain
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain (e.g., `qrrestaurant.com`)
3. Follow DNS instructions provided by Vercel

#### 6.2 Update Environment Variables
Update `NEXTAUTH_URL` to your custom domain:
```
NEXTAUTH_URL=https://qrrestaurant.com
```

### Step 7: Maintenance and Updates

#### 7.1 Making Updates
```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will automatically redeploy your application.

#### 7.2 Monitoring
- Check Vercel dashboard for deployment logs
- Monitor function executions and performance
- Set up error tracking (optional)

### Troubleshooting

#### Common Issues:

1. **Database Connection Issues**
   - Ensure `DATABASE_URL` is correctly set
   - Check if database file is properly initialized

2. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
   - Check if NextAuth is properly configured

3. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are properly installed

4. **QR Code Not Working**
   - Verify QR code generation API is working
   - Check if table data exists in database

### Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to GitHub
   - Use strong secrets for `NEXTAUTH_SECRET`

2. **Database Security**
   - Regular backups of SQLite database
   - Consider migrating to PostgreSQL for production

3. **User Authentication**
   - Implement rate limiting for login attempts
   - Use HTTPS (automatically provided by Vercel)

### Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component for all images
   - Implement lazy loading

2. **Database Optimization**
   - Add proper indexes to frequently queried fields
   - Implement caching strategies

3. **CDN Usage**
   - Vercel automatically provides CDN for static assets
   - Use Edge Functions for better performance

### Scaling Considerations

For larger deployments, consider:

1. **Database Migration**
   - Move from SQLite to PostgreSQL or MySQL
   - Use managed database services

2. **Load Balancing**
   - Vercel automatically handles scaling
   - Consider multiple regions for global deployment

3. **Monitoring**
   - Set up analytics and monitoring
   - Implement error tracking services

---

## Super Admin Login Credentials

### Default Super Admin Account:
- **Email**: `superadmin@qrrestaurant.com`
- **Password**: `superadmin123`
- **Role**: SUPER_ADMIN

### Access URLs:
- **Homepage**: `https://your-app-name.vercel.app`
- **Login**: `https://your-app-name.vercel.app/auth/signin`
- **Super Admin Dashboard**: `https://your-app-name.vercel.app/admin/super`

### First Steps After Login:

1. **Change Password**: Immediately change the default super admin password
2. **Add Restaurants**: Create your first restaurant and branches
3. **Add Menu Items**: Populate the menu with actual items
4. **Test Ordering**: Test the complete ordering flow
5. **Add Staff**: Create user accounts for restaurant staff

### Sample Data Included:
- 1 Restaurant: "Sample Restaurant"
- 2 Branches: "Gulshan Branch" and "Dhanmondi Branch"
- 4 Menu Categories: Appetizers, Main Course, Desserts, Beverages
- 9 Menu Items with realistic prices
- 18 Tables (10 in Gulshan, 8 in Dhanmondi)

---

## Support

If you encounter any issues during deployment:
1. Check Vercel deployment logs
2. Review this guide for missed steps
3. Ensure all environment variables are correctly set
4. Verify database initialization completed successfully

For advanced issues, consider checking:
- Next.js documentation
- Vercel documentation
- Prisma documentation
- NextAuth.js documentation