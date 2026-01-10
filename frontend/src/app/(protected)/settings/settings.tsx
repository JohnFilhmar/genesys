'use client';

import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Globe,
  Shield,
  Save,
  Mail,
  School,
  Clock,
  Users,
  Eye,
  CheckCircle2,
  Settings as SettingsIcon
} from "lucide-react";
import { useState } from "react";

function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  
  // Mock user data - Replace with actual data from useAuth hook
  const [profileData, setProfileData] = useState({
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'juan.delacruz@school.edu.ph',
    school: 'Puerto Galera National High School',
    department: 'Science Department'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    roomStartAlerts: true,
    studentJoinAlerts: false,
    weeklyReport: true,
    systemUpdates: true
  });

  const [roomDefaults, setRoomDefaults] = useState({
    defaultTimeLimit: 3600,
    maxStudents: 30,
    allowLateJoin: true,
    showResults: true,
    autoCloseAfter: 24
  });

  const [displaySettings, setDisplaySettings] = useState({
    language: 'en',
    theme: 'light'
  });

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'room-defaults', name: 'Room Defaults', icon: SettingsIcon },
    { id: 'display', name: 'Display', icon: Palette },
    { id: 'privacy', name: 'Privacy', icon: Shield }
  ];

  const handleSaveProfile = () => {
    // Implement save logic with API call
    console.log('Saving profile:', profileData);
  };

  const handleSaveNotifications = () => {
    // Implement save logic
    console.log('Saving notifications:', notificationSettings);
  };

  const handleSaveRoomDefaults = () => {
    // Implement save logic
    console.log('Saving room defaults:', roomDefaults);
  };

  const handleSaveDisplay = () => {
    // Implement save logic
    console.log('Saving display settings:', displaySettings);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-1 text-sm md:text-base">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 sticky top-4">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-bio-100 text-bio-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  {section.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-bio-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-bio-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Profile Information</h3>
                    <p className="text-sm text-slate-500">Update your personal information and school details.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">School</label>
                    <div className="relative">
                      <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={profileData.school}
                        onChange={(e) => setProfileData({...profileData, school: e.target.value})}
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                    <input
                      type="text"
                      value={profileData.department}
                      onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button 
                      onClick={handleSaveProfile}
                      className="px-6 py-2.5 bg-bio-600 hover:bg-bio-700 text-white font-semibold rounded-xl shadow-lg shadow-bio-600/20 flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Security Settings</h3>
                    <p className="text-sm text-slate-500">Manage your password and account security.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-900 font-medium mb-1">Password Requirements:</p>
                    <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                      <li>At least 8 characters long</li>
                      <li>Contains uppercase and lowercase letters</li>
                      <li>Includes at least one number</li>
                      <li>Has at least one special character</li>
                    </ul>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button className="px-6 py-2.5 bg-bio-600 hover:bg-bio-700 text-white font-semibold rounded-xl shadow-lg shadow-bio-600/20 flex items-center gap-2 transition-all active:scale-95">
                      <Save className="w-4 h-4" />
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-dna-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-dna-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Notification Preferences</h3>
                    <p className="text-sm text-slate-500">Choose what updates you want to receive.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email updates about your account activity' },
                    { key: 'roomStartAlerts', label: 'Room Start Alerts', description: 'Get notified when you start a new room session' },
                    { key: 'studentJoinAlerts', label: 'Student Join Alerts', description: 'Receive alerts when students join your rooms' },
                    { key: 'weeklyReport', label: 'Weekly Summary Report', description: 'Get a weekly summary of your teaching activities' },
                    { key: 'systemUpdates', label: 'System Updates', description: 'Receive notifications about new features and updates' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 text-sm mb-1">{item.label}</h4>
                        <p className="text-xs text-slate-500">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({
                          ...notificationSettings,
                          [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notificationSettings[item.key as keyof typeof notificationSettings] ? 'bg-bio-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notificationSettings[item.key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button 
                      onClick={handleSaveNotifications}
                      className="px-6 py-2.5 bg-bio-600 hover:bg-bio-700 text-white font-semibold rounded-xl shadow-lg shadow-bio-600/20 flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Room Defaults Section */}
            {activeSection === 'room-defaults' && (
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <SettingsIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Room Default Settings</h3>
                    <p className="text-sm text-slate-500">Set default preferences for creating new rooms.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Default Time Limit (seconds)</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        value={roomDefaults.defaultTimeLimit}
                        onChange={(e) => setRoomDefaults({...roomDefaults, defaultTimeLimit: parseInt(e.target.value)})}
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Default time limit for questions in new rooms</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Maximum Students</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        value={roomDefaults.maxStudents}
                        onChange={(e) => setRoomDefaults({...roomDefaults, maxStudents: parseInt(e.target.value)})}
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Default maximum number of students per room</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Auto-close After (hours)</label>
                    <input
                      type="number"
                      value={roomDefaults.autoCloseAfter}
                      onChange={(e) => setRoomDefaults({...roomDefaults, autoCloseAfter: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                    />
                    <p className="text-xs text-slate-500 mt-1">Automatically close rooms after this duration</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Allow Late Join</h4>
                        <p className="text-xs text-slate-500">Let students join after the room has started</p>
                      </div>
                      <button
                        onClick={() => setRoomDefaults({...roomDefaults, allowLateJoin: !roomDefaults.allowLateJoin})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          roomDefaults.allowLateJoin ? 'bg-bio-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            roomDefaults.allowLateJoin ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Show Results</h4>
                        <p className="text-xs text-slate-500">Display results to students after completion</p>
                      </div>
                      <button
                        onClick={() => setRoomDefaults({...roomDefaults, showResults: !roomDefaults.showResults})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          roomDefaults.showResults ? 'bg-bio-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            roomDefaults.showResults ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button 
                      onClick={handleSaveRoomDefaults}
                      className="px-6 py-2.5 bg-bio-600 hover:bg-bio-700 text-white font-semibold rounded-xl shadow-lg shadow-bio-600/20 flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      Save Defaults
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Display Section */}
            {activeSection === 'display' && (
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-bio-100 rounded-xl flex items-center justify-center">
                    <Palette className="w-6 h-6 text-bio-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Display Preferences</h3>
                    <p className="text-sm text-slate-500">Customize your visual experience.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        value={displaySettings.language}
                        onChange={(e) => setDisplaySettings({...displaySettings, language: e.target.value})}
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option value="en">English</option>
                        <option value="fil">Filipino</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Theme</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setDisplaySettings({...displaySettings, theme: 'light'})}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          displaySettings.theme === 'light'
                            ? 'border-bio-600 bg-bio-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg"></div>
                          <div className="text-left">
                            <p className="font-semibold text-slate-900 text-sm">Light</p>
                            <p className="text-xs text-slate-500">Default theme</p>
                          </div>
                        </div>
                        {displaySettings.theme === 'light' && (
                          <CheckCircle2 className="w-5 h-5 text-bio-600 mt-2" />
                        )}
                      </button>

                      <button
                        onClick={() => setDisplaySettings({...displaySettings, theme: 'dark'})}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          displaySettings.theme === 'dark'
                            ? 'border-bio-600 bg-bio-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-lg"></div>
                          <div className="text-left">
                            <p className="font-semibold text-slate-900 text-sm">Dark</p>
                            <p className="text-xs text-slate-500">Coming soon</p>
                          </div>
                        </div>
                        {displaySettings.theme === 'dark' && (
                          <CheckCircle2 className="w-5 h-5 text-bio-600 mt-2" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button 
                      onClick={handleSaveDisplay}
                      className="px-6 py-2.5 bg-bio-600 hover:bg-bio-700 text-white font-semibold rounded-xl shadow-lg shadow-bio-600/20 flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Section */}
            {activeSection === 'privacy' && (
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Privacy & Data</h3>
                    <p className="text-sm text-slate-500">Manage your data and privacy settings.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-900 mb-3">Data Collection</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      We collect data to improve your teaching experience. Your student performance data is stored securely and never shared without your consent.
                    </p>
                    <button className="text-sm text-bio-600 hover:text-bio-700 font-medium flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      View Privacy Policy
                    </button>
                  </div>

                  <div className="p-5 border-2 border-dna-200 bg-dna-50 rounded-xl">
                    <h4 className="font-semibold text-dna-900 mb-2">Danger Zone</h4>
                    <p className="text-sm text-dna-700 mb-4">
                      These actions are permanent and cannot be undone.
                    </p>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2.5 border border-dna-300 hover:bg-dna-100 text-dna-700 text-sm font-medium rounded-lg transition-colors text-left">
                        Export All My Data
                      </button>
                      <button className="w-full px-4 py-2.5 bg-dna-600 hover:bg-dna-700 text-white text-sm font-medium rounded-lg transition-colors">
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;