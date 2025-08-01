import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, Save, Users, User } from "lucide-react";

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [familyMode, setFamilyMode] = useState(user?.familyMode || false);

  if (!user) return null;

  const handleSave = () => {
    updateProfile({
      name,
      email,
      familyMode,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setFamilyMode(user.familyMode || false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback className="text-lg">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                disabled={user.isDemo}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <div className="flex gap-2">
                {user.isDemo ? (
                  <Badge variant="secondary">Demo Account</Badge>
                ) : (
                  <Badge variant="default">Verified Account</Badge>
                )}
                {user.familyMode && (
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    Family Mode
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {user.isDemo && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                Demo Mode
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                You're currently using FinanceBot in demo mode. Create an
                account to save your data and access all features.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/signup">Create Account</a>
              </Button>
            </div>
          )}

          {/* Edit Profile Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">Account Information</h4>
              <div className="space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={user.isDemo}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={user.isDemo}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing || user.isDemo}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing || user.isDemo}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family Finance
          </CardTitle>
          <CardDescription>
            Enable family mode to manage shared finances with your family
            members
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="family-mode">Family Mode</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Combine incomes and expenses with family members
              </p>
            </div>
            <Switch
              id="family-mode"
              checked={familyMode}
              onCheckedChange={setFamilyMode}
              disabled={user.isDemo || !isEditing}
            />
          </div>

          {familyMode && (
            <div className="space-y-4 pt-4 border-t">
              <h5 className="font-medium">Family Members</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-gray-500">Owner</div>
                    </div>
                  </div>
                  <Badge variant="default">You</Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={user.isDemo}
                >
                  Invite Family Member
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={logout}>
              {user.isDemo ? "Exit Demo Mode" : "Sign Out"}
            </Button>
            {!user.isDemo && (
              <Button variant="destructive" disabled>
                Delete Account
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
