# CakeIT
Your favorite bakery, and more, just a tap away!

![black_on_white](https://github.com/user-attachments/assets/d5de7150-46e2-446b-b9d2-5af983e66480)

![ezgif com-animated-gif-maker](https://github.com/user-attachments/assets/05322e8b-c211-4f5d-8cbf-b3656065c9a7)


## Project Proposal

### 1. Problem Statement
In our town, there is no centralized platform for customers to easily view offerings from multiple bakeries, place custom orders, or arrange convenient delivery or pickup. Bakeries, in turn, lack a platform to manage orders, especially custom ones, and to communicate directly with customers.

### 2. Proposed Solution
CakeIt will be a mobile app where:
- **Customers** can browse bakeries, view products, place custom cake orders, and choose delivery or pickup options.
- **Bakeries** can manage orders, propose changes, and reserve a slot in a shared easybox for customer pickup.
- **Admins** oversee all orders and manage the easybox system.

### 3. Target Audience
- **Customers** who want an easy way to explore and order from local bakeries.
- **Bakeries** that need a better system to manage orders and communicate with clients.

### 4. Tools & Technologies

- **Frontend**: React for building interactive user interfaces.
- **Backend**: Node.js with Express to handle server-side logic and API creation.
- **Database**: MongoDB for flexible, document-based data handling.
- **State Management**: Context API or Redux (if needed) for managing app-wide state in React.
- **HTTP Client**: Axios for communication between the frontend and backend.

### 5. Timeline & Milestones
- **Week 3**: Requirements Gathering & Design.
- **Week 4-5**: Implement Customer and Bakery roles.
- **Week 6**: Integrate Easybox feature.
- **Week 7**: Admin Dashboard & Testing.
- **Week 8**: Final Testing & Submission.

## Requirements Gathering

### 1. Functional Requirements

#### Customer Role:
- Browse through multiple bakeries and their products.
- Place standard or custom cake orders.
- Communicate with bakeries via a message thread.
- Choose delivery, in-store collection, or pickup from a shared easybox.
- View real-time availability of easybox slots and reserve one.
- Receive notifications for order updates (accepted, declined, modified).

#### Bakery Role:
- Upload and update product listings.
- Manage orders (accept, decline, propose changes).
- Reserve a slot in the easybox for customer orders.
- Receive notifications for new orders and customer messages.

#### Admin Role:
- Monitor all orders placed via the app.
- Manage easybox reservations to prevent overbooking.
- View details of any specific order or easybox reservation.

### 2. Non-Functional Requirements

#### Performance:
- The app must handle 1000+ concurrent users with < 2s delay for real-time updates.

#### Reliability:
- The app must have 99% uptime, ensuring continuous access to order management.

#### Usability:
- The user interface must be intuitive and simple for both Android and iOS users.

#### Security:
- All sensitive data must be encrypted, and only authenticated users should access their roles.

### 3. Techniques to Gather Requirements

#### Use Cases/User Stories
- **Customer**: “As a customer, I want to browse bakeries and place a custom order.”
- **Bakery**: “As a bakery owner, I want to manage all incoming orders and communicate with customers.”
- **Admin**: “As an admin, I want to monitor easybox reservations and ensure smooth operation.”

#### Stakeholder Interviews
- Conduct interviews with bakery owners, customers, and admin personnel.
- **Example Questions**:
  - For bakeries: “How do you handle custom orders, and would a messaging feature help?”
  - For customers: “Would you prefer picking up from an easybox, and what would make the process more convenient?”

#### Workshops & Focus Groups
- Host workshops with bakery owners to co-design the order management interface.
- Organize focus groups with customers to refine the app’s user experience.

#### Surveys & Questionnaires
- Distribute surveys to gather broad user preferences.
- **Example Questions**:
  - For customers: “How often would you use an easybox for pickup?”
  - For bakeries: “Would you prefer real-time notifications for new/updated orders?”

## High-Level Architecture
### MERN Stack Architecture for CakeIt

#### Architecture Overview
- **Full Stack JavaScript**: Using JavaScript across the entire stack (React, Node.js, Express, MongoDB) for a unified codebase.

#### Components

##### Mobile App
- **Framework**: React (or React Native if developing for mobile).
- **User Roles**:
  - **Customer**: Browse bakeries, place orders, communicate with bakeries.
  - **Bakery**: Manage products and orders.
  - **Admin**: Monitor orders and manage easybox reservations.

##### Backend Logic
- **Framework**: Node.js with Express for creating RESTful APIs that handle business logic (e.g., order processing, user authentication).
  
##### Database
- **Service**: MongoDB for storing user and order data in a flexible, schema-less format.

##### Real-Time Communication
- **Notifications**: Use WebSockets or a notification service like Firebase Cloud Messaging for real-time notifications (optional).

#### Component Interactions
- **Frontend-Backend Communication**: Axios is used on the frontend to send HTTP requests to the backend Express API.
- **Database Interaction**: Backend communicates with MongoDB for CRUD operations on user data, order data, and easybox reservations.

#### Deployment
- **Hosting**: Deploy the backend on a server (e.g., AWS, Heroku) and the React frontend on a service like Vercel or Netlify.
- **CI/CD**: Automate deployments with tools like GitHub Actions.

#### Development Steps
1. **Set Up React Project for Frontend**: Create components and pages for each user role.
2. **Implement Backend APIs**: Use Express to set up routes for customers, bakeries, and admin functionalities.
3. **Connect MongoDB Database**: Set up Mongoose models for users, orders, and easybox reservations.
4. **Add Real-Time Features**: Integrate notifications for order updates and easybox availability.
5. **Testing**: Ensure all features function correctly across all user roles.
6. **Deployment**: Deploy both the backend and frontend to respective hosting services.

#### Benefits
- **Unified Codebase**: JavaScript across frontend, backend, and database makes development faster and easier to maintain.
- **Scalability**: The MERN stack allows for easy expansion of features and scaling of each layer independently.
