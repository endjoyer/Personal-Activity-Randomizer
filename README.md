# Personal Activity Randomizer (PAR)

<p align="center">
  <img src="/public/images/par-icon.png" alt="PAR Logo" width="200"/>
</p>

## 🤔 About <a name="about"></a>

A modern web application for organizing and randomly selecting leisure activities to eliminate decision fatigue and enhance your free time experience.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📝 Table of Contents

- [About](#about)
- [Purpose of the Application](#purpose)
- [Features](#features)
- [Development Stage](#development)
- [Technologies](#technologies)
- [Project Structure](#structure)
- [Getting Started](#getting-started)
- [Internationalization](#internationalization)
- [Author](#author)

## 🎯 Purpose of the Application <a name="purpose"></a>

Everyone has faced this scenario: You've just completed a challenging task, and it's time to relax, but you can't decide what to do. You're too tired to think, and before you know it, you've spent an hour watching random YouTube videos or scrolling through social media. Eventually, you go to bed feeling like your time wasn't meaningfully spent.

**Personal Activity Randomizer** solves this problem by letting you create lists of activities you'd enjoy during your free time. When you're too tired to decide, just click a button and let PAR suggest what to do next! Don't like the suggestion? Just re-roll or pick directly from your list.

## ✨ Features <a name="features"></a>

- **User Account System**: Secure signup/login with JWT authentication
- **Customizable Sections**: Create, edit, and organize your own activity categories
- **Activity Management**: Add, edit, delete, and reorder activities within sections
- **Smart Randomization**: Weighted random option gives higher chances to newer activities
- **Drag & Drop Interface**: Easy reordering of sections and activities
- **Ready-to-Use Collections**: Pre-populated activity lists across various categories
- **Multi-language Support**: Available in English and Russian
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚧 Development Stage (Beta) <a name="development"></a>

Currently, the app is still under development. Some planned features aren't implemented or finalized, and code refactoring has yet to be completed. Roughly 85% of the plan is finished. Future improvements are in progress. It would be incredibly helpful if you could share any suggestions for additional features or enhancements with me!

## 💻 Technologies <a name="technologies"></a>

### Core Technologies:

- **TypeScript**: Strongly typed programming language
- **Next.js**: React framework with SSR capabilities
- **Redux Toolkit**: State management library
- **MongoDB**: NoSQL database for data storage
- **Tailwind CSS**: Utility-first CSS framework

### Additional Libraries and Tools:

- **@hello-pangea/dnd**: Drag and drop functionality (fork of react-beautiful-dnd)
- **axios**: Promise-based HTTP client
- **bcryptjs**: Password hashing library
- **i18next**: Internationalization framework
- **jose**: JavaScript implementation of JSON Object Signing and Encryption
- **js-cookie**: Cookie handling JavaScript API
- **jsonwebtoken**: Implementation of JSON Web Tokens
- **mongoose**: MongoDB object modeling tool
- **NextUI**: UI component library for React
- **nookies**: Cookie parsing and setting
- **react-beautiful-dnd**: Accessible drag and drop for lists
- **react-i18next**: React bindings for i18next
- **uuid**: For generating unique identifiers

## 📁 Project Structure <a name="structure"></a>

```

├── app/ # Next.js 13 App Router files
│ ├── [locale]/ # Locale-specific routes
│ ├── api/ # API endpoints
│ ├── login/ # Login page
│ ├── register/ # Registration page
│ ├── styles/ # Global styles
│ ├── ReduxProvider.tsx # Redux context provider
│ ├── layout.tsx # Root layout component
│ └── page.tsx # Home page component
├── components/ # React components
│ ├── ActivityForm.tsx # Form for adding activities
│ ├── ActivityList.tsx # List of activities
│ ├── ActivityRandomizer.tsx # Randomizer component
│ ├── Header.tsx # Page header
│ ├── Loader.tsx # Loading indicator
│ ├── SectionsList.tsx # List of sections
│ └── withAuth.tsx # Authentication HOC
├── models/ # Mongoose data models
│ ├── Activity.ts # Activity schema
│ ├── Section.ts # Section schema
│ └── User.ts # User schema
├── public/ # Static files
│ └── images/ # Image assets
├── redux/ # Redux state management
│ ├── authSlice.ts # Authentication state
│ ├── sectionsSlice.ts # Sections and activities state
│ └── store.ts # Redux store configuration
├── utils/ # Utility functions
│ ├── activitiesData.ts # Predefined activities collections
│ ├── auth.ts # Authentication utilities
│ ├── dbConnect.ts # Database connection
│ ├── locales/ # i18n translation files
│ └── localStorageHelpers.ts # Local storage helpers
```

## 🏁 Getting Started <a name="getting-started"></a>

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB database

### Installation

1. Clone the repository:

```sh
   git clone https://github.com/endjoyer/personal-activity-randomizer.git
   cd personal-activity-randomizer
```

2. Install dependencies:

```sh
   npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with your MongoDB connection string and JWT secret:

```sh
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
```

4. Start the development server:

```sh
   npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Commands

# install dependencies

```sh
$ npm install

# run development server at localhost:3000
$ npm run dev

# build and start the server
$ npm run build
$ npm run start

# run linter
$ npm run lint
```

## 🌐 Internationalization <a name="internationalization"></a>

PAR currently supports:

- English (EN)
- Russian (RU)

The application uses i18next and react-i18next for internationalization. Translation files are located in the `/utils/locales/` directory. Language detection is automatic based on your browser settings, or you can manually select your preferred language.

## 👨‍💻 Author <a name="author"></a>

- **Abamzarov Aleksey** - Creator and maintainer
- Contact: [GitHub](https://github.com/endjoyer)

## 🤝 Contributing

Feedback and contributions are welcome! If you have suggestions for improvements or new features, please create an issue or submit a pull request.

---

<p align="center">
  <a href="https://personal-activity-randomizer.vercel.app/">Live Demo</a>
  •
  <a href="https://github.com/endjoyer/personal-activity-randomizer/issues">Report Bug</a>
  •
  <a href="https://github.com/endjoyer/personal-activity-randomizer/issues">Request Feature</a>
</p>
