# SkillBridge Connect

## Overview

SkillBridge Connect is a web-based platform designed to connect individuals seeking guidance with those who can provide mentorship and knowledge sharing. The project aims to bridge the gap between curiosity and expertise, creating a community where learning and teaching intersect. Currently implemented as a frontend-focused landing page with modern web technologies, the platform is positioned for future expansion into a full-featured mentorship and skill-sharing application.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Architecture
The application is a full-stack web platform built with modern technologies:

**Backend:**
- **Express.js Server**: RESTful API with user authentication endpoints
- **PostgreSQL Database**: Production database with fallback demo mode for development
- **Security Features**: Bcrypt password hashing, CORS protection, input validation
- **API Endpoints**: User registration, login, health checks, and user management

**Frontend:**
- **Static HTML Structure**: Clean semantic markup with a focus on accessibility and SEO
- **CSS-based Styling**: Modern CSS with gradient backgrounds, flexbox layouts, and responsive design principles
- **Vanilla JavaScript**: Event-driven interactions with DOM manipulation for enhanced user experience

### Design Patterns
- **Component-based CSS**: Modular CSS classes following BEM-like naming conventions
- **Progressive Enhancement**: Core functionality works without JavaScript, with JS adding enhanced interactions
- **Mobile-first Responsive Design**: Flexible layouts that adapt to different screen sizes

### User Interface Design
The interface employs a dark theme aesthetic with:
- Dark background (#1a1a1a) for reduced eye strain
- Gradient accents for visual appeal
- Fixed navigation bar with smooth transitions
- Hero section with clear call-to-action

### Performance Considerations
- Minimal external dependencies
- CSS-only animations where possible
- Efficient DOM manipulation with event delegation
- Optimized asset loading

## External Dependencies

### Backend Dependencies
- **express**: Web application framework for Node.js
- **cors**: Cross-Origin Resource Sharing middleware
- **bcrypt**: Password hashing library for security
- **pg**: PostgreSQL client for database operations
- **dotenv**: Environment variable management

### Frontend Dependencies
- **Fonts**: Arial fallback font family (system fonts)
- **No External Libraries**: Pure vanilla JavaScript implementation
- **No CSS Frameworks**: Custom CSS implementation

## Current Setup Status
- ✅ **Server Running**: Express.js server successfully running on port 5000
- ✅ **Dependencies Installed**: All Node.js packages installed via npm
- ✅ **Database Ready**: PostgreSQL support configured with demo mode fallback
- ✅ **Frontend Accessible**: Static files served and website fully functional
- ✅ **Deployment Configured**: Autoscale deployment setup for production
- ✅ **Host Configuration**: Server properly configured for Replit environment (0.0.0.0:5000)

### Future Integration Points
The current architecture is designed to accommodate future integrations:
- Database integration for user management and mentorship connections
- Authentication systems for user registration and login
- Real-time communication features for mentor-mentee interactions
- Payment processing for premium mentorship services
- File upload and sharing capabilities
- Email notification systems

The simple foundation allows for easy integration of backend services, databases, and additional frontend frameworks as the platform scales.