import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, Button } from '@/components/ui';
import { useToast } from '@/components/ui';
import { Save, School, Mail, Phone, MapPin, Calendar, Trophy, FileText } from 'lucide-react';

interface ProgramSettings {
  // School Information
  schoolName: string;
  teamName: string;
  motto: string;
  tagline: string;

  // Contact Information
  coachName: string;
  coachEmail: string;
  coachPhone: string;
  schoolAddress: string;
  schoolWebsite: string;

  // Homepage Settings
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;

  // Practice Schedule
  practiceSchedule: string;

  // Stats
  championships: number;

  // Branding
  primaryColor: string;
  secondaryColor: string;
}

const defaultSettings: ProgramSettings = {
  schoolName: 'Willard High School',
  teamName: 'Tigers',
  motto: 'Focused. Connected. Driven.',
  tagline: 'Building champions on and off the lanes',
  coachName: 'Coach',
  coachEmail: 'coach@willardtigers.com',
  coachPhone: '(417) 742-2296',
  schoolAddress: '500 East Kime Street, Willard, MO 65781',
  schoolWebsite: 'https://www.willardschools.net/',
  heroTitle: 'Strike Your Way to Victory',
  heroSubtitle: 'WILLARD TIGERS BOWLING TEAM',
  heroDescription: 'Join the most dynamic high school bowling program in the region. We\'re building champions, one frame at a time.',
  practiceSchedule: 'Monday & Wednesday at 3:30 PM',
  championships: 3,
  primaryColor: '#000000',
  secondaryColor: '#991B1B',
};

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<ProgramSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'programSettings', 'willard-tigers'));
        if (settingsDoc.exists()) {
          setSettings({ ...defaultSettings, ...settingsDoc.data() as ProgramSettings });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        showToast('error', 'Error loading settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [showToast]);

  const handleChange = (field: keyof ProgramSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'programSettings', 'willard-tigers'), {
        ...settings,
        updatedAt: new Date(),
      });
      showToast('success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiger-primary-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-tiger-primary-black">Program Settings</h2>
          <p className="text-tiger-neutral-600 mt-1">Configure your team's information and homepage content</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={Save}
          onClick={handleSave}
          loading={saving}
          disabled={saving}
        >
          Save Changes
        </Button>
      </div>

      {/* School Information */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <School className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-black text-tiger-primary-black">School & Team Information</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              School Name
            </label>
            <input
              type="text"
              value={settings.schoolName}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={settings.teamName}
              onChange={(e) => handleChange('teamName', e.target.value)}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              Team Motto
            </label>
            <input
              type="text"
              value={settings.motto}
              onChange={(e) => handleChange('motto', e.target.value)}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
              placeholder="Focused. Connected. Driven."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
            />
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-xl">
            <Mail className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-black text-tiger-primary-black">Contact Information</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Coach Name
            </label>
            <input
              type="text"
              value={settings.coachName}
              onChange={(e) => handleChange('coachName', e.target.value)}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Coach Email
            </label>
            <input
              type="email"
              value={settings.coachEmail}
              onChange={(e) => handleChange('coachEmail', e.target.value)}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Coach Phone
            </label>
            <input
              type="tel"
              value={settings.coachPhone}
              onChange={(e) => handleChange('coachPhone', e.target.value)}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
              placeholder="(417) 555-0123"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              School Website
            </label>
            <input
              type="url"
              value={settings.schoolWebsite}
              onChange={(e) => handleChange('schoolWebsite', e.target.value)}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              School Address
            </label>
            <input
              type="text"
              value={settings.schoolAddress}
              onChange={(e) => handleChange('schoolAddress', e.target.value)}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
            />
          </div>
        </div>
      </Card>

      {/* Homepage Content */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-black text-tiger-primary-black">Homepage Content</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              Hero Title
            </label>
            <input
              type="text"
              value={settings.heroTitle}
              onChange={(e) => handleChange('heroTitle', e.target.value)}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
              placeholder="Strike Your Way to Victory"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              Hero Subtitle
            </label>
            <input
              type="text"
              value={settings.heroSubtitle}
              onChange={(e) => handleChange('heroSubtitle', e.target.value)}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
              placeholder="WILLARD TIGERS BOWLING TEAM"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              Hero Description
            </label>
            <textarea
              value={settings.heroDescription}
              onChange={(e) => handleChange('heroDescription', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition resize-none"
            />
          </div>
        </div>
      </Card>

      {/* Practice & Stats */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-yellow-100 rounded-xl">
            <Calendar className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-black text-tiger-primary-black">Practice & Stats</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Practice Schedule
            </label>
            <input
              type="text"
              value={settings.practiceSchedule}
              onChange={(e) => handleChange('practiceSchedule', e.target.value)}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
              placeholder="Monday & Wednesday at 3:30 PM"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              <Trophy className="w-4 h-4 inline mr-1" />
              Championships Won
            </label>
            <input
              type="number"
              value={settings.championships}
              onChange={(e) => handleChange('championships', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border-2 border-tiger-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
              min="0"
            />
          </div>
        </div>
      </Card>

      {/* Save Button at Bottom */}
      <div className="flex justify-end pt-4">
        <Button
          variant="primary"
          size="xl"
          icon={Save}
          onClick={handleSave}
          loading={saving}
          disabled={saving}
        >
          Save All Changes
        </Button>
      </div>
    </div>
  );
};
