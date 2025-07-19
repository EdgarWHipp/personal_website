import React, { useState } from 'react';

export default function PrivacyEncryption({ onClose, onPrivacySettingsUpdate }) {
  const [settings, setSettings] = useState({
    dataEncryption: true,
    localStorageOnly: true,
    analyticsEnabled: false,
    sessionRecording: false,
    dataRetention: '30',
    shareAnonymousData: false
  });
  
  const [consent, setConsent] = useState({
    dataProcessing: false,
    thirdPartyServices: false,
    researchParticipation: false
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleConsentChange = (key, value) => {
    setConsent(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onPrivacySettingsUpdate(settings, consent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-5/6 overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">P</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Privacy & Security</h2>
              <p className="text-sm text-gray-500">Control your data and privacy settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Data Security Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Data Security</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">End-to-End Encryption</label>
                  <p className="text-xs text-gray-500">Encrypt all session data locally</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dataEncryption}
                  onChange={(e) => handleSettingChange('dataEncryption', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Local Storage Only</label>
                  <p className="text-xs text-gray-500">Never send data to external servers</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.localStorageOnly}
                  onChange={(e) => handleSettingChange('localStorageOnly', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Data Collection Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800">Data Collection</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Analytics</label>
                  <p className="text-xs text-gray-500">Usage analytics for app improvement</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.analyticsEnabled}
                  onChange={(e) => handleSettingChange('analyticsEnabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Session Recording</label>
                  <p className="text-xs text-gray-500">Record sessions for quality assurance</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.sessionRecording}
                  onChange={(e) => handleSettingChange('sessionRecording', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Anonymous Research Data</label>
                  <p className="text-xs text-gray-500">Share anonymized data for mental health research</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.shareAnonymousData}
                  onChange={(e) => handleSettingChange('shareAnonymousData', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Data Retention Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800">Data Retention</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-delete data after (days)
              </label>
              <select
                value={settings.dataRetention}
                onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
                <option value="never">Never delete</option>
              </select>
            </div>
          </div>

          {/* Consent Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800">Consent & Legal</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={consent.dataProcessing}
                  onChange={(e) => handleConsentChange('dataProcessing', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div>
                  <label className="text-sm font-medium text-gray-700">Data Processing Consent</label>
                  <p className="text-xs text-gray-500">I consent to processing my data for mental health support</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={consent.thirdPartyServices}
                  onChange={(e) => handleConsentChange('thirdPartyServices', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div>
                  <label className="text-sm font-medium text-gray-700">Third-Party AI Services</label>
                  <p className="text-xs text-gray-500">Allow use of external AI providers (OpenAI, Claude) when configured</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={consent.researchParticipation}
                  onChange={(e) => handleConsentChange('researchParticipation', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div>
                  <label className="text-sm font-medium text-gray-700">Research Participation</label>
                  <p className="text-xs text-gray-500">Contribute anonymized data to mental health research</p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 font-bold">!</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Important Privacy Notice</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  This app is a prototype. For real mental health support, please consult with licensed professionals. 
                  In crisis situations, contact emergency services immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
} 