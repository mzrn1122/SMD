# Smart Medicine Dispenser (SMD) - Full-Stack Dashboard

A comprehensive IoT-enabled medication management system with role-based dashboards for caregivers and administrators.

## 🚀 Features

### Caregiver Dashboard
- **7-Day Adherence Grid**: Visual representation of medication adherence with color-coded status
- **Inventory Engine (KK Model)**: 60-day virtual stock management with automatic depletion tracking
- **Refill Alerts**: Toast notifications when physical slots are empty
- **Triple-Check Verification Logs**: Detailed view of Face ID, IR Sensor, and Load Cell verification
- **30-Day Adherence Chart**: Interactive trend visualization using Recharts
- **Clinical Timeline**: 2-month progress bar with visit tracking
- **PDF Export**: Generate comprehensive 60-day adherence reports for doctors

### Admin Dashboard
- **Fleet Monitor**: Real-time monitoring of all registered devices
- **WiFi Signal Tracking**: RSSI values with visual signal strength indicators
- **Device Heartbeat Status**: Live connection monitoring
- **Remote Commands**: Send MQTT commands (REMOTE_RESET, FORCE_SYNC, etc.)
- **Hardware Error Feed**: Real-time error and warning notifications
- **Custom Command Interface**: Send custom JSON commands via MQTT

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite) + Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **IoT Communication**: MQTT.js (with mock service for testing)
- **PDF Generation**: jsPDF
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd c:\Users\user\OneDrive\Desktop\SMD
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173`

## 🗄️ Database Schema

### Required Supabase Tables

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  role TEXT CHECK (role IN ('admin', 'caregiver')),
  patient_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  age INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Devices table
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT UNIQUE,
  status TEXT,
  rssi INTEGER,
  battery INTEGER,
  uptime INTEGER,
  last_heartbeat TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Logs table
CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id),
  event TEXT,
  verification JSONB,
  remaining_stock INTEGER,
  timestamp TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inventory table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id),
  virtual_stock INTEGER,
  physical_slots INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Schedules table
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id),
  slots INTEGER[],
  time TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)

Enable RLS on all tables and create policies:

```sql
-- Caregivers can only see their assigned patients
CREATE POLICY "Caregivers see own patients" ON logs
  FOR SELECT USING (
    patient_id IN (
      SELECT patient_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Admins can see everything
CREATE POLICY "Admins see all" ON logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## 🎮 Demo Credentials

The system includes demo credentials for testing:

### Caregiver Account
- Email: `caregiver@smd.com`
- Password: `caregiver123`

### Admin Account
- Email: `admin@smd.com`
- Password: `admin123`

**Note**: These are for demonstration only. You'll need to create these users in your Supabase Auth dashboard.

## 🔌 IoT Integration

### MQTT Topics

The system uses the following MQTT topics:

#### Device → Server
- `smd/logs`: Medication events
  ```json
  {
    "event": "taken",
    "verification": {
      "face": true,
      "ir": true,
      "load": true
    },
    "remaining_stock": 59,
    "timestamp": "2026-01-20T13:43:00Z",
    "device_id": "SMD_001"
  }
  ```

- `smd/heartbeat`: Device status updates
  ```json
  {
    "device_id": "SMD_001",
    "rssi": -52,
    "battery": 95,
    "uptime": 345600,
    "status": "online"
  }
  ```

- `smd/errors`: Hardware errors
  ```json
  {
    "device_id": "SMD_001",
    "error_type": "Motor Jam",
    "severity": "error",
    "timestamp": "2026-01-20T13:43:00Z"
  }
  ```

#### Server → Device
- `smd/sync`: Schedule updates
  ```json
  {
    "command": "UPDATE_SCHEDULE",
    "device_id": "SMD_001",
    "slots": [1,2,3,4,5,6,7],
    "time": "08:00"
  }
  ```

- `smd/commands`: Remote commands
  ```json
  {
    "device_id": "SMD_001",
    "command": "REMOTE_RESET",
    "params": {},
    "timestamp": "2026-01-20T13:43:00Z"
  }
  ```

### Mock Mode

The system currently runs in **mock mode** for testing without real hardware:
- Simulates periodic dose events
- Generates device heartbeats
- Creates random hardware errors
- Responds to sync commands

To connect to a real MQTT broker:
1. Set `mockMode = false` in `src/services/mqttService.js`
2. Install mqtt.js: `npm install mqtt`
3. Configure broker URL in environment variables

## 📱 Features in Detail

### Inventory Management (KK Model)
- **Virtual Stock**: Tracks 60-day medication supply
- **Physical Slots**: Monitors 7-slot motor dispenser
- **Auto-Depletion**: Decrements stock on each "taken" event
- **Refill Alerts**: Notifies when slots are empty

### Triple Verification System
- **Face Recognition**: Confirms patient identity
- **IR Sensor**: Detects medication removal
- **Load Cell**: Verifies weight change
- Success rates calculated and displayed

### Clinical Reports
- Generates PDF reports with jsPDF
- Includes 60-day adherence statistics
- Verification success rates
- Recent activity log
- Formatted for doctor review

## 🎨 Design Features

- **Dark Theme**: Premium dark mode with glassmorphism
- **Animated Backgrounds**: Subtle gradient animations
- **Micro-interactions**: Hover effects and transitions
- **Responsive Design**: Works on desktop and tablet
- **Real-time Updates**: Live data via MQTT and Supabase Realtime
- **Toast Notifications**: User-friendly feedback

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set environment variables
3. Deploy with default settings

### Backend Setup
For production MQTT:
1. Set up an MQTT broker (e.g., HiveMQ, Mosquitto)
2. Configure authentication
3. Update environment variables
4. Enable SSL/TLS

## 📝 Development Notes

### Mock Data
The system generates realistic mock data for testing:
- 30 days of medication logs
- 85% adherence rate
- Random verification failures
- Device heartbeats every 30 seconds
- Occasional hardware errors

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL schema from above
3. Enable RLS policies
4. Create demo users in Auth
5. Add credentials to `.env`

## 🔒 Security

- **Row Level Security**: Caregivers see only their patients
- **Role-Based Access**: Admin and caregiver routes protected
- **Environment Variables**: Sensitive data in .env
- **Auth Required**: All routes require authentication

## 📄 License

MIT License - Feel free to use for your projects

## 🤝 Contributing

This is a demonstration project. For production use:
1. Implement proper authentication
2. Add input validation
3. Set up real MQTT broker
4. Configure production database
5. Add error logging
6. Implement rate limiting

## 📞 Support

For issues or questions:
- Check the documentation
- Review the code comments
- Test with mock data first
- Verify Supabase configuration

---

**Built with ❤️ for better medication adherence**
