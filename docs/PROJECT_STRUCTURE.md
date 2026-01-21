# 📁 Project Structure Guide

## Overview

This document explains the reorganized project structure for the Smart Medicine Dispenser (SMD) application. The new structure follows industry best practices for scalability, maintainability, and developer experience.

---

## 🗂️ Directory Structure

```
src/
├── assets/                 # Static assets (images, fonts, icons)
├── components/             # React components
│   ├── common/            # Shared components (Button, Card, Badge, etc.)
│   ├── layout/            # Layout components (Header, Sidebar, Footer)
│   ├── caregiver/         # Caregiver-specific components
│   │   ├── dashboard/     # Dashboard widgets
│   │   ├── adherence/     # Adherence tracking components
│   │   ├── medication/    # Medication management
│   │   ├── appointments/  # Appointment components
│   │   ├── inventory/     # Inventory management
│   │   ├── verification/  # Triple-check verification
│   │   └── patient/       # Patient profile components
│   └── admin/             # Admin-specific components
│       ├── fleet/         # Device fleet monitoring
│       ├── commands/      # Remote command interface
│       └── errors/        # Error tracking
├── pages/                 # Page components (Login, Dashboard, etc.)
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── services/              # API and external services
├── utils/                 # Utility functions
│   ├── generators/        # PDF, report generators
│   ├── helpers/           # Helper functions
│   └── constants.js       # Application constants
├── lib/                   # External library configurations
├── config/                # App configuration
└── styles/                # Global styles and themes
```

---

## 📦 Import Aliases

The project uses absolute imports for cleaner code:

```javascript
// ❌ Old way (relative imports)
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../components/common/Button';

// ✅ New way (absolute imports)
import { useAuth } from '@contexts/AuthContext';
import { Button } from '@components/common';
```

### Available Aliases

- `@/` → `src/`
- `@components/` → `src/components/`
- `@pages/` → `src/pages/`
- `@hooks/` → `src/hooks/`
- `@utils/` → `src/utils/`
- `@services/` → `src/services/`
- `@contexts/` → `src/contexts/`
- `@lib/` → `src/lib/`
- `@config/` → `src/config/`
- `@styles/` → `src/styles/`

---

## 🎯 Barrel Exports

Each component directory has an `index.js` file for cleaner imports:

```javascript
// Instead of:
import { LiveVitals } from '@components/caregiver/dashboard/LiveVitals';
import { DailyIntakeTracker } from '@components/caregiver/dashboard/DailyIntakeTracker';

// You can use:
import { LiveVitals, DailyIntakeTracker } from '@components/caregiver/dashboard';
```

---

## 🧩 Component Organization

### Common Components (`src/components/common/`)

Reusable UI components used throughout the app:

- **Button** - Customizable button with variants (primary, secondary, danger, etc.)
- **Card** - Container component with consistent styling
- **Badge** - Status indicators and labels
- **Loader** - Loading states
- **ProtectedRoute** - Route authentication wrapper

**Usage:**
```javascript
import { Button, Card, Badge } from '@components/common';

<Card padding="lg">
  <Badge variant="success">Active</Badge>
  <Button variant="primary" size="md">Click Me</Button>
</Card>
```

### Caregiver Components (`src/components/caregiver/`)

Organized by feature:

- **dashboard/** - Real-time monitoring widgets
- **adherence/** - Medication adherence tracking
- **medication/** - Medication management
- **appointments/** - Appointment scheduling
- **inventory/** - Stock management
- **patient/** - Patient profile and onboarding

### Admin Components (`src/components/admin/`)

- **fleet/** - Device fleet monitoring
- **commands/** - Remote device commands
- **errors/** - Hardware error tracking

---

## 🪝 Custom Hooks (`src/hooks/`)

Reusable React hooks for common functionality:

### useLocalStorage
Sync state with localStorage:
```javascript
import { useLocalStorage } from '@hooks';

const [theme, setTheme] = useLocalStorage('theme', 'light');
```

### useDebounce
Debounce values (useful for search):
```javascript
import { useDebounce } from '@hooks';

const debouncedSearchTerm = useDebounce(searchTerm, 500);
```

### useInterval
Manage intervals with proper cleanup:
```javascript
import { useInterval } from '@hooks';

useInterval(() => {
  // Runs every 5 seconds
  fetchData();
}, 5000);
```

---

## 🛠️ Utility Functions (`src/utils/`)

### Date Helpers (`utils/helpers/dateHelpers.js`)

```javascript
import { formatDate, getRelativeTime, format12Hour } from '@utils/helpers';

formatDate(new Date(), 'short'); // "Jan 20, 2026"
getRelativeTime(date); // "2 hours ago"
format12Hour('14:30'); // "2:30 PM"
```

### Format Helpers (`utils/helpers/formatHelpers.js`)

```javascript
import { capitalize, formatPhone, formatPercentage } from '@utils/helpers';

capitalize('hello'); // "Hello"
formatPhone('1234567890'); // "(123) 456-7890"
formatPercentage(87.5); // "87.5%"
```

### Validation Helpers (`utils/helpers/validationHelpers.js`)

```javascript
import { isValidEmail, validatePassword } from '@utils/helpers';

isValidEmail('test@example.com'); // true
validatePassword('MyPass123!'); // { isValid: true, strength: 'strong', ... }
```

### Constants (`utils/constants.js`)

Centralized configuration:
```javascript
import { USER_ROLES, DEVICE_STATUS, STORAGE_KEYS } from '@utils/constants';

if (user.role === USER_ROLES.ADMIN) {
  // Admin logic
}
```

---

## 🔌 Services (`src/services/`)

External API and service integrations:

- **mqttService.js** - MQTT broker communication
- **supabaseService.js** - Database operations (future)
- **apiService.js** - REST API calls (future)

---

## 🎨 Styling

Global styles are in `src/styles/`:
- `index.css` - Global styles and Tailwind imports
- `themes/` - Light and dark theme definitions

---

## 📝 Best Practices

### 1. Component Structure

```javascript
// ComponentName.jsx
import React from 'react';
import PropTypes from 'prop-types';

export const ComponentName = ({ prop1, prop2 }) => {
  // Component logic
  
  return (
    // JSX
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

export default ComponentName;
```

### 2. File Naming

- **Components**: PascalCase (`PatientProfile.jsx`)
- **Utilities**: camelCase (`dateHelpers.js`)
- **Constants**: UPPERCASE (`API_ENDPOINTS.js`)
- **Hooks**: camelCase with 'use' prefix (`useLocalStorage.js`)

### 3. Import Order

```javascript
// 1. External libraries
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal absolute imports
import { useAuth } from '@contexts/AuthContext';
import { Button, Card } from '@components/common';
import { formatDate } from '@utils/helpers';

// 3. Relative imports (if needed)
import './styles.css';
```

### 4. Barrel Exports

Always create `index.js` files in component directories:

```javascript
// src/components/common/index.js
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Badge } from './Badge';
```

---

## 🚀 Quick Start

### Adding a New Component

1. Create the component file in the appropriate directory
2. Add it to the directory's `index.js` barrel export
3. Import using the barrel export path

```javascript
// 1. Create: src/components/common/Modal.jsx
export const Modal = ({ children }) => { /* ... */ };

// 2. Add to: src/components/common/index.js
export { default as Modal } from './Modal';

// 3. Use anywhere:
import { Modal } from '@components/common';
```

### Adding a New Utility

1. Create the utility file in `src/utils/helpers/`
2. Export functions
3. Add to helpers barrel export if needed

```javascript
// 1. Create: src/utils/helpers/arrayHelpers.js
export const unique = (arr) => [...new Set(arr)];

// 2. Add to: src/utils/helpers/index.js
export * from './arrayHelpers';

// 3. Use:
import { unique } from '@utils/helpers';
```

---

## 📚 Additional Resources

- [React Best Practices](https://react.dev/learn)
- [Vite Configuration](https://vitejs.dev/config/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🤝 Contributing

When adding new features:

1. Follow the established directory structure
2. Use absolute imports
3. Create barrel exports for new directories
4. Document complex components
5. Add PropTypes for type checking

---

**Happy Coding! 🎉**
