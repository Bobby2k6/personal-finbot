import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { 
  Settings as SettingsIcon, 
  Palette, 
  Bell, 
  Shield, 
  Download,
  Upload,
  Trash2,
  Save
} from "lucide-react";

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      monthlyReports: true,
      goalReminders: true,
    },
    privacy: {
      profileVisible: false,
      dataSharing: false,
    },
    preferences: {
      currency: "INR",
      language: "en",
      dateFormat: "DD/MM/YYYY",
      budgetAlerts: true,
    }
  });

  const handleSaveSettings = () => {
    // TODO: Save settings to backend
    console.log("Saving settings:", settings);
    setIsEditing(false);
  };

  const handleExportData = () => {
    // TODO: Implement data export
    console.log("Exporting user data...");
  };

  const handleImportData = () => {
    // TODO: Implement data import
    console.log("Importing user data...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how FinanceBot looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="theme">Theme</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose your preferred color scheme
              </p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="currency">Currency</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Default currency for displaying amounts
              </p>
            </div>
            <Select 
              value={settings.preferences.currency} 
              onValueChange={(value) => setSettings(prev => ({
                ...prev,
                preferences: { ...prev.preferences, currency: value }
              }))}
              disabled={user?.isDemo}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">₹ INR</SelectItem>
                <SelectItem value="USD">$ USD</SelectItem>
                <SelectItem value="EUR">€ EUR</SelectItem>
                <SelectItem value="GBP">£ GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how and when you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.notifications.email}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, email: checked }
              }))}
              disabled={user?.isDemo}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="monthly-reports">Monthly Reports</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get monthly financial summary reports
              </p>
            </div>
            <Switch
              id="monthly-reports"
              checked={settings.notifications.monthlyReports}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, monthlyReports: checked }
              }))}
              disabled={user?.isDemo}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="goal-reminders">Goal Reminders</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Reminders about your financial goals
              </p>
            </div>
            <Switch
              id="goal-reminders"
              checked={settings.notifications.goalReminders}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, goalReminders: checked }
              }))}
              disabled={user?.isDemo}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="budget-alerts">Budget Alerts</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Alert when approaching budget limits
              </p>
            </div>
            <Switch
              id="budget-alerts"
              checked={settings.preferences.budgetAlerts}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                preferences: { ...prev.preferences, budgetAlerts: checked }
              }))}
              disabled={user?.isDemo}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Control your data privacy and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="profile-visible">Public Profile</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Allow others to view your profile
              </p>
            </div>
            <Switch
              id="profile-visible"
              checked={settings.privacy.profileVisible}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                privacy: { ...prev.privacy, profileVisible: checked }
              }))}
              disabled={user?.isDemo}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="data-sharing">Data Sharing</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share anonymized data for product improvement
              </p>
            </div>
            <Switch
              id="data-sharing"
              checked={settings.privacy.dataSharing}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                privacy: { ...prev.privacy, dataSharing: checked }
              }))}
              disabled={user?.isDemo}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Export, import, or delete your financial data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={handleExportData}
              disabled={user?.isDemo}
              className="justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>

            <Button 
              variant="outline" 
              onClick={handleImportData}
              disabled={user?.isDemo}
              className="justify-start"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Delete Account</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                disabled={user?.isDemo}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={user?.isDemo}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {user?.isDemo && (
        <div className="text-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <Badge variant="secondary" className="mb-2">Demo Mode</Badge>
          <p>Sign in to modify your settings and save preferences</p>
        </div>
      )}
    </div>
  );
}
