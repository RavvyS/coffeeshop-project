'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Gift, 
  Bell,
  Shield,
  Camera,
  Edit,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    phone: '',
    address: '',
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      promotionalEmails: false,
    }
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement profile update with useAuth hook
      // await updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.user_metadata?.name || '',
      phone: '',
      address: '',
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        promotionalEmails: false,
      }
    });
    setIsEditing(false);
  };

  const loyaltyPoints = 450; // This would come from your user data
  const memberSince = new Date(user?.created_at || Date.now());
  const totalOrders = 28; // This would come from order history
  const favoriteItems = ['Cappuccino', 'Croissant', 'Latte']; // From order history

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-coffee-200 to-cream-200 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-coffee-600" />
                </div>
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 p-1.5 bg-coffee-500 text-white rounded-full hover:bg-coffee-600">
                    <Camera className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                    <Input
                      label="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      type="tel"
                    />
                    <Input
                      label="Address (Optional)"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Your address for deliveries"
                    />
                    <div className="flex space-x-3">
                      <Button onClick={handleSave} loading={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="ghost" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {formData.name || 'Add your name'}
                    </h2>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{user?.email}</span>
                      </div>
                      {formData.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{formData.phone}</span>
                        </div>
                      )}
                      {formData.address && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{formData.address}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <Badge variant="secondary">
                        Member since {memberSince.toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Order updates and important announcements</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.emailNotifications}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, emailNotifications: e.target.checked }
                  }))}
                  className="toggle"
                  disabled={!isEditing}
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Real-time order status updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.pushNotifications}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, pushNotifications: e.target.checked }
                  }))}
                  className="toggle"
                  disabled={!isEditing}
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Promotional Emails</p>
                  <p className="text-sm text-gray-600">Special offers and new menu items</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.preferences.promotionalEmails}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, promotionalEmails: e.target.checked }
                  }))}
                  className="toggle"
                  disabled={!isEditing}
                />
              </label>
            </div>
          </Card>

          {/* Account Security */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Account Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Password</p>
                  <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                </div>
                <Button variant="ghost" size="sm">
                  Change Password
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add extra security to your account</p>
                </div>
                <Button variant="ghost" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Loyalty Status */}
          <Card className="p-6 bg-gradient-to-br from-coffee-500 to-coffee-600 text-white">
            <div className="text-center">
              <Star className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
              <h3 className="text-lg font-semibold mb-2">Loyalty Points</h3>
              <div className="text-3xl font-bold mb-2">{loyaltyPoints}</div>
              <p className="text-coffee-100 text-sm mb-4">
                50 points away from your next reward!
              </p>
              <div className="w-full bg-coffee-400 rounded-full h-2 mb-4">
                <div className="bg-yellow-300 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <Button variant="secondary" size="sm">
                <Gift className="h-4 w-4 mr-2" />
                View Rewards
              </Button>
            </div>
          </Card>

          {/* Account Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-semibold">{totalOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Spent</span>
                <span className="font-semibold">$347.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Favorite Drink</span>
                <span className="font-semibold">Cappuccino</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member Level</span>
                <Badge variant="success">Gold</Badge>
              </div>
            </div>
          </Card>

          {/* Favorite Items */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Items</h3>
            <div className="space-y-3">
              {favoriteItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{item}</span>
                  <Button variant="ghost" size="sm">
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Download My Data
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Privacy Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-600">
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}