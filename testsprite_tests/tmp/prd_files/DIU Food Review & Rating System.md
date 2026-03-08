# Project Idea: DIU Food Review & Rating System 🎯 Core Objective

It is specifically designed for food stalls at Daffodil International University (DIU). The proposed platform features a user-friendly interface accessible via mobile and desktop, allowing students to authenticate using their university email credentials or Google accounts. Once logged in, users can view food menus, browse shop details, and post public comments and ratings on specific items. Shop owners are provided with a dedicated dashboard to manage their listings, monitor feedback, and interact with customers through a reply system. Technical considerations discussed include real-time notifications via Telegram or PWA technology and the role of a super-admin in manually overseeing account creation. Ultimately, the project aims to enhance the campus dining experience by fostering transparent communication between vendors and the student body.

---

To create a web-based review and rating system for the shops/stalls inside the DIU campus (Food Cottage, Green Garden, Tea Stalls, etc.).  
Where students can log in to give ratings and reviews, and shop owners can reply to those reviews.👤 User Types

1️⃣ **Student / General User**

* Logs in using Google Sign-In or name, email, password  
* Can view the list of shops  
* For each shop:  
  * Rating  
  * Review  
  * Comment  
  * Food Menu  
* Can give a rating (Star system)  
* Can comment  
* Can view others comment  
* Can view their own reviews  
* Can view the leaderboard ranking the highest-rated shops *(New)*

**2️⃣ Shop Owner / Stall Manager**

* Account is created through a specific process (manually or with authentication on auth page)  
* Has their own shop dashboard  
* Can view their shop's:  
  * Rating  
  * Review  
  * Can reply to comments  
* Can add products/menu items  
* Can set products as Active / Stock Out


**3️⃣ Super Admin**

* Can manually create Shop Owner accounts  
* Can analise users rating for shops  
* Can add new shops  
* User Management  
* System Control  
* Proper Analytix  
* Confirm shop owner authenction

**🔐 Authentication System**

* Google Sign-In can be used  
* Automatic verification for DIU emails()  
* General Gmail can also be used for login  
* For Shop Owners:  
  * Separate verification  
  * shop owner have to sinup as Shop owner  
  * If sinup as a shop owner super admin need to confirm

**⭐ Review System (Main Focus)Features:**

* 1 to 5 Star Rating  
* Text Review  
* Public Comment  
* Shop Owner can reply  
* A review cannot be deleted once submitted (historical data will remain)  
* Automatic calculation of rating average

**🛍 What will be on the Shop Page**

* Shop Image  
* Shop Name  
* Average Rating  
* Menu List  
* Status of each item:  
  * Active  
  * Stock Out  
* Review Section  
* Comment Section

**📱 UI / UX Design**

* Web Based (Desktop Friendly)  
* Mobile Friendly (Responsive Design)  
* PWA can be built in the future  
* User interface has dashboard with sidebar on desktop view (Sidebar will include a "Leaderboard / Top Rated" navigation link)  
* Mobile view have bottom navigation 

**🔔 Notification System(Future Scope)**

Can be done in two ways:

1. In-app Notification  
2. Email Notification  
3. Future: Telegram Channel or FCM Push Notification

**💬 Chat System For Evey Shop(Future Scope)**

* Real-time chat can be added in the future  
* The main focus now is the review system

**🔄 System Flow (Generally)**

1. User and shop owner Signup / Login  
2. List of shops on the Dashboard  
3. Enter a shop's page  
4. View Menu  
5. Give Rating  
6. User checks the Leaderboard for top food recommendations  
7. Comment  
8. Shop Owner replies  
9. User receives Notification

---

**🏆 Leaderboard System (Top Rated Shops)**

* A dedicated ranking page or dashboard widget displaying the highest-rated food stalls at DIU.  
* Ranks shops dynamically based on the automatic calculation of their rating average.  
* Implements a minimum review threshold (e.g., a shop must have at least 5 or 10 reviews) to qualify for the leaderboard, preventing new shops with a single 5-star review from skewing the ranks.

**⚠️ Important Considerations**

* Performance optimization is needed (there was an issue in the previous project)  
* Data structure must be clear  
* Editing should be limited once a review is submitted  
* Fake reviews can be filtered using an algorithm

**Technology Stack & ArchitectureFramework:** 

* Next.js 16+ (App Router, React Server Components)  
* Styling: Tailwind CSS 3.4+ with custom design tokens  
* Database: Supabase (PostgreSQL \+ Row Level Security)  
* Auth: Supabase Auth (email / social OAuth)  
* State Management: Zustand or React Context (client-side only)  
* SEO: Next.js Metadata API, JSON-LD structured data, next-sitemap