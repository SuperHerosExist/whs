import React, { useState } from 'react';
import { Settings, Image, Palette, Save } from 'lucide-react';
import { WillardLogo } from '@/components/WillardLogo';
import { branding } from '@/config/branding';

export const CoachSettings: React.FC = () => {
  const [activeLogo, setActiveLogo] = useState<'primary' | 'secondary'>(
    branding.logos.activeLogo
  );
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage('');

    try {
      // TODO: Save to Firestore in teamBranding collection
      // For now, just simulate a save
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSavedMessage('Settings saved successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSavedMessage('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 via-willard-white to-willard-grey-100">
      {/* Header */}
      <section className="bg-gradient-to-br from-willard-black via-willard-grey-900 to-willard-grey-800 text-white py-16">
        <div className="w-full max-w-[95%] 2xl:max-w-[1600px] mx-auto px-6">
          <div className="flex items-center gap-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-6 shadow-tiger-2xl">
              <Settings className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black">COACH SETTINGS</h1>
              <p className="text-xl md:text-2xl text-willard-grey-300 mt-2 font-bold">
                Configure team branding and appearance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Settings Content */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        {/* Logo Selection */}
        <div className="bg-white rounded-3xl p-8 shadow-tiger-lg mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Image className="w-8 h-8 text-willard-grey-800" />
            <h2 className="text-3xl font-black text-willard-black">Team Logo</h2>
          </div>

          <p className="text-willard-grey-600 mb-8">
            Choose which logo to display on player profiles and throughout the site.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Primary Logo (Tiger) */}
            <div
              onClick={() => setActiveLogo('primary')}
              className={`relative cursor-pointer rounded-3xl p-8 transition-all ${
                activeLogo === 'primary'
                  ? 'bg-gradient-to-br from-willard-grey-900 to-willard-black text-white shadow-tiger-xl scale-105'
                  : 'bg-willard-grey-100 hover:bg-willard-grey-200 shadow-tiger'
              }`}
            >
              {activeLogo === 'primary' && (
                <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full px-3 py-1 text-sm font-bold">
                  ACTIVE
                </div>
              )}

              <div className="flex justify-center mb-4">
                <WillardLogo variant="primary" size={120} />
              </div>

              <h3
                className={`text-center text-xl font-black ${
                  activeLogo === 'primary' ? 'text-white' : 'text-willard-black'
                }`}
              >
                Tiger Logo
              </h3>
              <p
                className={`text-center text-sm mt-2 ${
                  activeLogo === 'primary' ? 'text-willard-grey-300' : 'text-willard-grey-600'
                }`}
              >
                Full tiger mascot
              </p>
            </div>

            {/* Secondary Logo (W) */}
            <div
              onClick={() => setActiveLogo('secondary')}
              className={`relative cursor-pointer rounded-3xl p-8 transition-all ${
                activeLogo === 'secondary'
                  ? 'bg-gradient-to-br from-willard-grey-900 to-willard-black text-white shadow-tiger-xl scale-105'
                  : 'bg-willard-grey-100 hover:bg-willard-grey-200 shadow-tiger'
              }`}
            >
              {activeLogo === 'secondary' && (
                <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full px-3 py-1 text-sm font-bold">
                  ACTIVE
                </div>
              )}

              <div className="flex justify-center mb-4">
                <WillardLogo variant="secondary" size={120} />
              </div>

              <h3
                className={`text-center text-xl font-black ${
                  activeLogo === 'secondary' ? 'text-white' : 'text-willard-black'
                }`}
              >
                W Logo
              </h3>
              <p
                className={`text-center text-sm mt-2 ${
                  activeLogo === 'secondary' ? 'text-willard-grey-300' : 'text-willard-grey-600'
                }`}
              >
                School letter mark
              </p>
            </div>
          </div>
        </div>

        {/* Color Scheme (Future Feature) */}
        <div className="bg-white rounded-3xl p-8 shadow-tiger-lg mb-8 opacity-50">
          <div className="flex items-center gap-4 mb-6">
            <Palette className="w-8 h-8 text-willard-grey-800" />
            <h2 className="text-3xl font-black text-willard-black">Color Scheme</h2>
            <span className="text-sm bg-willard-grey-200 text-willard-grey-700 px-3 py-1 rounded-full font-bold">
              COMING SOON
            </span>
          </div>

          <p className="text-willard-grey-600 mb-6">
            Customize team colors and branding (feature coming soon)
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-willard-black h-20 rounded-2xl flex items-center justify-center text-white font-bold">
              Primary
            </div>
            <div className="bg-willard-grey-600 h-20 rounded-2xl flex items-center justify-center text-white font-bold">
              Secondary
            </div>
            <div className="bg-yellow-500 h-20 rounded-2xl flex items-center justify-center text-willard-black font-bold">
              Accent
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-willard-black to-willard-grey-800 text-white py-5 px-8 rounded-2xl font-black text-xl hover:shadow-tiger-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {saving ? (
              <>
                <div className="animate-spin text-2xl">🎳</div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                Save Settings
              </>
            )}
          </button>
        </div>

        {/* Save Message */}
        {savedMessage && (
          <div
            className={`mt-4 p-4 rounded-2xl text-center font-bold ${
              savedMessage.includes('Error')
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {savedMessage}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-3xl p-6">
          <h3 className="text-lg font-black text-blue-900 mb-2">Note for Coaches</h3>
          <p className="text-blue-800">
            Logo changes will be reflected across the entire site including player profiles,
            roster pages, and marketing materials. Custom logo uploads coming soon!
          </p>
        </div>
      </section>
    </div>
  );
};
