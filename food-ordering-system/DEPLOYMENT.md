# Food Ordering System - Setup & Deployment Guide

## ✅ What Has Been Built

Your complete food ordering system frontend is ready! Here's what's included:

### Three Main Interfaces

#### 1. **Customer Kiosk/Online Order** 👤
- Beautiful grid-based menu display with food items and prices
- Search functionality to filter menu items
- Shopping cart with add/remove/quantity adjustment
- Real-time total calculation with tax (10%)
- Order confirmation page with QR code generation
- Order number for pickup tracking
- **Responsive Design**: Works on desktop, tablet (vertical nav), mobile

#### 2. **Cashier POS System** 💳
- Real-time order queue management
- Search orders by order number or customer ID
- Order status workflow: Pending → Preparing → Ready → Served
- Detailed order information panel
- KPI dashboard (pending, ready, total orders)
- Print receipt functionality
- Color-coded status indicators
- Professional POS-style interface

#### 3. **Admin Dashboard** 📊
- KPI cards for revenue, orders, average value, completion rate
- Sales analytics with visual charts
- Top-selling items ranking
- Cashier management (add/edit/remove accounts)
- Sales reports with order history table
- Export and analytics capabilities
- Real-time metric calculations

## 🎨 Design Implementation

### McDonald's/KFC Aesthetic Applied
✅ **Color Scheme**:
- Bold Red (#DC2626) - Primary brand color, appetite stimulation
- Gold/Yellow (#FCD34D) - Secondary accent, optimism & speed
- Deep Charcoal (#1F2937) - Professional admin interface
- White background - Cleanliness and fast service feel

✅ **Typography**:
- Poppins Bold (Display font) - Bold, modern, energetic
- Plus Jakarta Sans (Body font) - Clean and readable
- NO generic Inter/Arial/Roboto fonts (avoided "AI slop")

✅ **Layout & Interaction**:
- Large, touch-friendly buttons (56px minimum for kiosk)
- Asymmetric grid-breaking layouts
- Smooth animations and transitions
- Clear visual hierarchy
- Deep shadows for depth and dimension
- Micro-interactions on button presses

✅ **Responsiveness**:
- Desktop: Full-featured multi-column layouts
- Tablet: Optimized touch targets and vertical navigation
- Mobile: Single-column, touch-first interface
- All elements scale appropriately

## 🚀 How to Run the Project

### Option 1: Development Mode (Recommended for Testing)

```bash
# Navigate to the project directory
cd "c:\BSIT 2A Files\CC 205\Group-3-Final-Project\food-ordering-system"

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run on `http://localhost:5173`

### Option 2: Production Build

```bash
# Build for production
npm run build

# This creates a "dist" folder with optimized files

# Preview the production build
npm run preview
```

### Option 3: Deploy to Web Server

1. Run `npm run build` to generate the `dist` folder
2. Upload the `dist` folder contents to your web server
3. Configure your server for SPA routing (redirects to index.html)

## 🔐 Login Credentials (Demo)

### Customer
- No login required - automatically creates guest customer on order confirmation

### Cashier
- **Username**: `cashier1`
- **Password**: `cashier123`

### Admin
- **Username**: `admin`
- **Password**: `admin123`

## 💾 Data Storage

Currently, the app uses **browser localStorage** for demo purposes:
- Orders persist across browser refreshes
- User sessions persist until logout
- No backend required for testing

**For Production**: Replace localStorage with MySQL/MariaDB backend

## 🔧 Integration with PHP Backend

### Form Data Structure
All forms are ready to POST data to your PHP backend:

```javascript
// Example order submission
{
  customerId: "customer_123456789",
  items: [
    { id: "1", name: "Big Mac", quantity: 2, price: 7.99 },
    { id: "3", name: "French Fries", quantity: 1, price: 2.49 }
  ],
  total: 18.47,
  status: "pending"
}
```

### API Endpoints to Implement (PHP)
See README.md for complete list, including:
- POST /api/auth/login
- POST /api/orders
- GET /api/orders
- PUT /api/orders/{id}
- GET /api/analytics/summary
- And more...

### Database Setup (MySQL/XAMPP)
See README.md for complete SQL schema with:
- Users table (cashiers/admins)
- Customers table
- Orders table
- Order Items table
- Menu Items table

## 📱 Feature Highlights

### Customer Experience
✨ Intuitive touch-friendly interface
✨ Large, easy-to-tap buttons
✨ Visual feedback on all interactions
✨ Clear order confirmation with QR code
✨ Quick order summary before checkout
✨ Professional ordering flow

### Cashier Workflow
⚡ Quick order lookup and processing
⚡ Clear status transition flow
⚡ Real-time KPI updates
⚡ Print-ready receipts
⚡ Efficient order queue management
⚡ Professional POS layout

### Admin Capabilities
📊 Real-time sales analytics
📊 Revenue tracking
📊 Top-selling items insights
📊 Cashier team management
📊 Sales reports and exports
📊 Performance metrics

## 🎯 Design Improvements Included

1. **Progressive Disclosure** - Show only relevant info per role
2. **Color-Coded Status** - Orders easily identifiable by status
3. **Toast & Badge Notifications** - Clear feedback on actions
4. **Responsive Touch Targets** - Minimum 56px buttons for kiosk
5. **Visual Hierarchy** - Clear primary/secondary information
6. **Satisfying Animations** - Smooth transitions on order actions
7. **Popular Items Featured** - Top sellers visible on menu
8. **Quick Analytics** - Key metrics instantly visible to admin
9. **Print Support** - Professional receipt printing
10. **Search & Filter** - Quickly find orders and menu items

## 🛠️ Customization

### Change Brand Colors
Edit `/src/index.css` CSS variables:

```css
:root {
  --primary-red: #DC2626;        /* Change to your brand red */
  --secondary-gold: #FCD34D;      /* Change to your brand gold */
  --dark-char: #1F2937;           /* Change dark color */
}
```

### Change Menu Items
Edit `/src/pages/CustomerKiosk.tsx` MENU_ITEMS array:

```javascript
const MENU_ITEMS: OrderItem[] = [
  { id: '1', name: 'Your Item', price: 9.99, quantity: 0, image: '🍔' },
  // Add more items...
];
```

### Modify Demo Credentials
Edit `/src/App.tsx` handleLogin function to change credentials

## ⚠️ Important Notes

### Demo Limitations
- Uses localStorage (data lost if cleared)
- Emoji for food images (replace with actual images in production)
- No real payment processing
- No QR code scanning (display only)
- No SMS/Email notifications yet

### Before Production Deployment
- [ ] Implement real backend with PHP/MySQL
- [ ] Remove demo credentials (use database auth)
- [ ] Add SSL/HTTPS
- [ ] Implement payment processing
- [ ] Add email notifications
- [ ] Set up QR code scanning
- [ ] Add inventory management
- [ ] Implement user management
- [ ] Add audit logging
- [ ] Test on actual POS hardware

## 📁 Project Structure

```
food-ordering-system/
├── src/
│   ├── pages/
│   │   ├── LogIn.tsx / .css          (335+ lines styled)
│   │   ├── CustomerKiosk.tsx / .css  (450+ lines styled)
│   │   ├── CashierPOS.tsx / .css     (380+ lines styled)
│   │   └── AdminDashboard.tsx / .css (450+ lines styled)
│   ├── App.tsx / App.css             (Core app logic)
│   ├── index.css                     (Design system & globals)
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md                         (Complete documentation)
└── DEPLOYMENT.md                     (This file)
```

## 🐛 Troubleshooting

**Q: App won't start**
A: Run `npm install` again; check Node.js version (need 18+)

**Q: Styles not showing**
A: Clear browser cache; restart dev server

**Q: Orders disappearing**
A: Check browser privacy settings; localStorage might be disabled

**Q: Mobile view broken**
A: Clear cache; ensure viewport meta tag in index.html

## 📞 Support

For questions or issues:
1. Check README.md for detailed documentation
2. Review component comments in source files
3. Check browser console for error messages
4. Verify MySQL database is running if using backend

## 🎉 Next Steps

1. ✅ **Run the app**: `npm run dev`
2. **Test each role**: Login as customer, cashier, admin
3. **Place test orders**: Try menu browsing and QR code generation
4. **Customize branding**: Edit CSS variables and menu items
5. **Connect backend**: Implement PHP API endpoints
6. **Deploy**: Build and upload to production server

---

**Version**: 1.0.0
**Created**: March 28, 2026
**Built with**: React 18 + TypeScript + Vite
**Status**: ✅ Ready for demonstration and backend integration
