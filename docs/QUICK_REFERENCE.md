# 🚀 Quick Reference Guide

## Common Import Patterns

### Components
```javascript
// Common UI Components
import { Button, Card, Badge, Loader, ProtectedRoute } from '@components/common';

// Caregiver Components
import { LiveVitals, DailyIntakeTracker } from '@components/caregiver/dashboard';
import { AdherenceCalendar, MedicationIntakeTimeline } from '@components/caregiver/adherence';
import { MedicationManager } from '@components/caregiver/medication';
import { AppointmentTimeline } from '@components/caregiver/appointments';
import { InventoryEngine } from '@components/caregiver/inventory';
import { PatientOnboarding } from '@components/caregiver/patient';

// Admin Components
import { FleetMonitor } from '@components/admin/fleet';
import { RemoteCommands } from '@components/admin/commands';
import { HardwareErrorFeed } from '@components/admin/errors';
```

### Hooks
```javascript
import { useLocalStorage, useDebounce, useInterval } from '@hooks';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
```

### Utilities
```javascript
// Helpers
import { 
  formatDate, 
  getRelativeTime, 
  format12Hour,
  capitalize,
  formatPhone,
  formatPercentage,
  isValidEmail,
  validatePassword
} from '@utils/helpers';

// Generators
import { generatePDF } from '@utils/generators/pdfGenerator';
import { generatePDFReport } from '@utils/generators/reportGenerator';

// Constants
import { 
  USER_ROLES, 
  DEVICE_STATUS, 
  STORAGE_KEYS,
  MEDICATION_FREQUENCIES 
} from '@utils/constants';
```

### Services
```javascript
import { mqttService } from '@services/mqttService';
import { supabase, dbHelpers } from '@lib/supabase';
```

### Pages
```javascript
import { Login } from '@pages/Login';
import { CaregiverDashboard } from '@pages/CaregiverDashboard';
import { AdminDashboard } from '@pages/AdminDashboard';
```

---

## Component Usage Examples

### Button
```javascript
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

// Variants: primary, secondary, danger, success, outline, ghost
// Sizes: sm, md, lg
```

### Card
```javascript
<Card padding="lg" hover>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>

// Padding: none, sm, md, lg
// hover: adds hover effect
```

### Badge
```javascript
<Badge variant="success" size="md">Active</Badge>

// Variants: default, primary, success, warning, danger, info
// Sizes: sm, md, lg
```

### Loader
```javascript
<Loader size="lg" text="Loading..." fullScreen />

// Sizes: sm, md, lg, xl
// fullScreen: boolean
```

---

## Hook Usage Examples

### useLocalStorage
```javascript
const [theme, setTheme] = useLocalStorage('theme', 'dark');

// Automatically syncs with localStorage
setTheme('light'); // Updates both state and localStorage
```

### useDebounce
```javascript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  // Only runs 500ms after user stops typing
  searchAPI(debouncedSearch);
}, [debouncedSearch]);
```

### useInterval
```javascript
useInterval(() => {
  // Runs every 5 seconds
  fetchLatestData();
}, 5000);

// Pass null to pause
useInterval(callback, isRunning ? 5000 : null);
```

---

## Utility Function Examples

### Date Helpers
```javascript
formatDate(new Date(), 'short');        // "Jan 20, 2026"
formatDate(new Date(), 'long');         // "Monday, January 20, 2026"
formatDate(new Date(), 'datetime');     // "Jan 20, 2026, 11:30 PM"

getRelativeTime(date);                  // "2 hours ago"
isToday(date);                          // true/false
timeFromNow(futureDate);                // "in 3 hours"
format12Hour('14:30');                  // "2:30 PM"
```

### Format Helpers
```javascript
capitalize('hello world');              // "Hello world"
toTitleCase('hello world');             // "Hello World"
truncate('Long text...', 20);           // "Long text..."
formatPhone('1234567890');              // "(123) 456-7890"
formatPercentage(87.5);                 // "87.5%"
formatCurrency(1234.56);                // "$1,234.56"
getInitials('John Doe');                // "JD"
pluralize(5, 'item');                   // "items"
```

### Validation Helpers
```javascript
isValidEmail('test@example.com');       // true
isValidPhone('123-456-7890');           // true
isRequired(value);                      // true/false
isInRange(50, 0, 100);                  // true
isValidURL('https://example.com');      // true
isValidDate('2026-01-20');              // true

const result = validatePassword('MyPass123!');
// { isValid: true, strength: 'strong', message: '...' }
```

---

## Constants Reference

### User Roles
```javascript
USER_ROLES.ADMIN        // 'admin'
USER_ROLES.CAREGIVER    // 'caregiver'
USER_ROLES.PATIENT      // 'patient'
```

### Device Status
```javascript
DEVICE_STATUS.ONLINE        // 'online'
DEVICE_STATUS.OFFLINE       // 'offline'
DEVICE_STATUS.WARNING       // 'warning'
DEVICE_STATUS.ERROR         // 'error'
DEVICE_STATUS.MAINTENANCE   // 'maintenance'
```

### Storage Keys
```javascript
STORAGE_KEYS.THEME              // 'smd_theme'
STORAGE_KEYS.PATIENT_PROFILE    // 'smd_patient_profile'
STORAGE_KEYS.USER_PREFERENCES   // 'smd_user_preferences'
```

### MQTT Topics
```javascript
MQTT_CONFIG.TOPICS.HEARTBEAT    // 'smd/heartbeat'
MQTT_CONFIG.TOPICS.LOGS         // 'smd/logs'
MQTT_CONFIG.TOPICS.ERRORS       // 'smd/errors'
MQTT_CONFIG.TOPICS.COMMANDS     // 'smd/commands'
```

---

## File Structure Quick Lookup

```
Need to add...                  → Create in...
├─ Reusable UI component       → src/components/common/
├─ Layout component            → src/components/layout/
├─ Caregiver feature           → src/components/caregiver/[feature]/
├─ Admin feature               → src/components/admin/[feature]/
├─ New page                    → src/pages/
├─ Custom hook                 → src/hooks/
├─ Utility function            → src/utils/helpers/
├─ Generator function          → src/utils/generators/
├─ API service                 → src/services/
├─ Context provider            → src/contexts/
├─ Configuration               → src/config/
└─ Documentation               → docs/
```

---

## Common Tasks

### Adding a New Component
1. Create component file in appropriate directory
2. Add to directory's `index.js`
3. Import using barrel export

### Adding a New Utility
1. Create in `src/utils/helpers/`
2. Export function
3. Add to `helpers/index.js` if needed

### Adding a New Hook
1. Create in `src/hooks/`
2. Export hook
3. Add to `hooks/index.js`

### Adding a New Constant
1. Add to `src/utils/constants.js`
2. Export from default object

---

## Troubleshooting

### Import not found?
- Check if barrel export exists
- Verify path alias in `vite.config.js`
- Ensure file is exported in `index.js`

### Component not rendering?
- Check PropTypes
- Verify all imports
- Check console for errors

### Hook not working?
- Ensure it's used inside a component
- Check dependencies array
- Verify hook rules

---

## Best Practices

✅ **DO:**
- Use absolute imports
- Create barrel exports
- Add PropTypes
- Document complex logic
- Follow naming conventions

❌ **DON'T:**
- Use relative imports for cross-directory
- Skip barrel exports
- Hardcode values (use constants)
- Duplicate code
- Mix naming conventions

---

**Happy Coding! 🚀**
