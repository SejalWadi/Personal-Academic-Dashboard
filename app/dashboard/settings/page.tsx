"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Download, 
  Trash2, 
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Loader2
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Mock user data - will be replaced with real data
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    studentId: "",
    major: "",
    year: "",
    gpa: "",
    phone: "",
    address: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    assignmentReminders: true,
    gradeUpdates: true,
    deadlineAlerts: true,
    weeklyReports: false,
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/dd/yyyy",
    startOfWeek: "monday",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    // Check for tab parameter in URL
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'notifications', 'preferences', 'privacy', 'data'].includes(tab)) {
      setActiveTab(tab);
    }

    // Load user profile data
    loadUserProfile();
  }, [status, router, searchParams]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        setUserProfile({
          name: user.name || "",
          email: user.email || "",
          studentId: user.studentId || "",
          major: user.major || "",
          year: user.year || "",
          gpa: user.gpa ? user.gpa.toString() : "",
          phone: "+1 (555) 123-4567", // Mock data
          address: "123 University Ave, College Town, ST 12345", // Mock data
        });
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "data", label: "Data & Export", icon: Download },
  ];

  const handleSave = async () => {
    if (activeTab === "profile") {
      try {
        setLoading(true);
        setSaveMessage("");

        const profileData = {
          name: userProfile.name,
          email: userProfile.email,
          studentId: userProfile.studentId || undefined,
          major: userProfile.major || undefined,
          year: userProfile.year || undefined,
          gpa: userProfile.gpa ? parseFloat(userProfile.gpa) : undefined,
        };

        const response = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        });

        if (response.ok) {
          setSaveMessage("Profile updated successfully!");
          setTimeout(() => setSaveMessage(""), 3000);
        } else {
          const errorData = await response.json();
          setSaveMessage(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Failed to save profile:", error);
        setSaveMessage("Failed to save changes. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // For other tabs, just show a mock success message
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Settings Navigation */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Settings Content */}
            <div className="lg:col-span-3 space-y-6">
              {saveMessage && (
                <Alert>
                  <AlertDescription>{saveMessage}</AlertDescription>
                </Alert>
              )}

              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and academic details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                        <AvatarFallback className="text-lg">
                          {userProfile.name.charAt(0) || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Change Photo
                        </Button>
                        <p className="text-sm text-muted-foreground mt-1">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Personal Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={userProfile.name}
                          onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          value={userProfile.studentId}
                          onChange={(e) => setUserProfile({...userProfile, studentId: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Academic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2" />
                        Academic Information
                      </h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="major">Major</Label>
                          <Input
                            id="major"
                            value={userProfile.major}
                            onChange={(e) => setUserProfile({...userProfile, major: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="year">Academic Year</Label>
                          <Select value={userProfile.year} onValueChange={(value) => setUserProfile({...userProfile, year: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Freshman">Freshman</SelectItem>
                              <SelectItem value="Sophomore">Sophomore</SelectItem>
                              <SelectItem value="Junior">Junior</SelectItem>
                              <SelectItem value="Senior">Senior</SelectItem>
                              <SelectItem value="Graduate">Graduate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gpa">Current GPA (out of 10)</Label>
                          <Input
                            id="gpa"
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={userProfile.gpa}
                            onChange={(e) => setUserProfile({...userProfile, gpa: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you want to be notified about important updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, emailNotifications: checked})
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications in your browser
                          </p>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, pushNotifications: checked})
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="assignment-reminders">Assignment Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Get reminded about upcoming assignment deadlines
                          </p>
                        </div>
                        <Switch
                          id="assignment-reminders"
                          checked={notifications.assignmentReminders}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, assignmentReminders: checked})
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="grade-updates">Grade Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Be notified when new grades are posted
                          </p>
                        </div>
                        <Switch
                          id="grade-updates"
                          checked={notifications.gradeUpdates}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, gradeUpdates: checked})
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="deadline-alerts">Deadline Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Urgent alerts for approaching deadlines
                          </p>
                        </div>
                        <Switch
                          id="deadline-alerts"
                          checked={notifications.deadlineAlerts}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, deadlineAlerts: checked})
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="weekly-reports">Weekly Reports</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive weekly progress summaries
                          </p>
                        </div>
                        <Switch
                          id="weekly-reports"
                          checked={notifications.weeklyReports}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, weeklyReports: checked})
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "preferences" && (
                <Card>
                  <CardHeader>
                    <CardTitle>App Preferences</CardTitle>
                    <CardDescription>
                      Customize your app experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={preferences.timezone} onValueChange={(value) => setPreferences({...preferences, timezone: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences({...preferences, dateFormat: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "privacy" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription>
                      Manage your privacy settings and account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Password</h3>
                        <Button variant="outline">
                          Change Password
                        </Button>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Add an extra layer of security to your account
                        </p>
                        <Button variant="outline">
                          Enable 2FA
                        </Button>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-2">Active Sessions</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Manage devices that are currently signed in to your account
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Current Session</p>
                              <p className="text-sm text-muted-foreground">Chrome on Windows • Active now</p>
                            </div>
                            <Badge variant="outline">Current</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "data" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>
                      Export your data or delete your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Export Data</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Download a copy of all your academic data
                      </p>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export All Data
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-2 text-red-600">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Permanently delete your account and all associated data
                      </p>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}