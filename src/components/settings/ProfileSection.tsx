
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const ProfileSection = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [locale, setLocale] = useState('en-US');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [avatar, setAvatar] = useState('/placeholder.svg');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleUpdateProfile = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Profile updated successfully');
      setIsUpdating(false);
    }, 1000);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    }, 1000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploadingAvatar(true);
      
      // Simulate upload
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setAvatar(event.target.result.toString());
          }
        };
        reader.readAsDataURL(e.target.files[0]);
        setIsUploadingAvatar(false);
        toast.success('Avatar uploaded');
      }, 1000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Profile Information</span>
        </CardTitle>
        <CardDescription>
          Update your personal information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-lg">{name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
              <label htmlFor="avatar-upload" className="w-full h-full flex items-center justify-center cursor-pointer">
                <span className="sr-only">Upload avatar</span>
                <Input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar} 
                />
                {isUploadingAvatar ? "Uploading..." : "Change"}
              </label>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <Label htmlFor="name">Display Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              disabled={isUpdating}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            value={email} 
            readOnly 
          />
        </div>

        <div className="space-y-4 border-t border-border pt-4">
          <h3 className="text-lg font-medium">Change Password</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                disabled={isChangingPassword}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                disabled={isChangingPassword}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                disabled={isChangingPassword}
              />
            </div>
            <Button 
              onClick={handleChangePassword} 
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="w-full sm:w-auto"
            >
              {isChangingPassword ? "Changing Password..." : "Change Password"}
            </Button>
          </div>
        </div>

        <div className="space-y-4 border-t border-border pt-4">
          <h3 className="text-lg font-medium">Regional Settings</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Time Zone</Label>
              <Select defaultValue={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="locale">Locale</Label>
              <Select defaultValue={locale} onValueChange={setLocale}>
                <SelectTrigger id="locale">
                  <SelectValue placeholder="Select locale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="fr-FR">Français</SelectItem>
                  <SelectItem value="de-DE">Deutsch</SelectItem>
                  <SelectItem value="ja-JP">日本語</SelectItem>
                  <SelectItem value="zh-CN">中文 (简体)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpdateProfile} 
          disabled={isUpdating}
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};
