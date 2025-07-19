import React, { useState } from 'react';
import KimiTherapyAPI from '../services/kimiAPI';

export default function AIModelConfig({ currentConfig, onClose, onConfigSaved }) {
  const [config, setConfig] = useState({
    provider: currentConfig?.provider || 'kimi',
    enabled: currentConfig?.enabled || false,
    apiKey: currentConfig?.apiKey || '',
    model: currentConfig?.model || 'moonshot-v1-32k',
    apiUrl: currentConfig?.apiUrl || 'https://api.moonshot.cn/v1',
    temperature: currentConfig?.temperature || 0.6,
    maxTokens: currentConfig?.maxTokens || 1000
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const providers = {
    kimi: {
      name: 'Kimi K2 (Moonshot AI)',
      models: ['moonshot-v1-32k', 'moonshot-v1-128k'],
      apiUrlPlaceholder: 'https://api.moonshot.cn/v1',
      keyFormat: 'sk-...',
      description: 'State-of-the-art MoE model with 1T parameters, specifically designed for agentic intelligence and mental health applications'
    }
  };

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    if (key === 'provider') {
      // Reset model when provider changes
      setConfig(prev => ({ 
        ...prev, 
        model: providers[value].models[0],
        apiUrl: providers[value].apiUrlPlaceholder 
      }));
    }
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);
    
    // Test connection to Kimi K2 API
    if (!config.apiKey || config.apiKey.length < 10) {
      setConnectionStatus({ success: false, message: 'Please provide a valid Moonshot AI API key' });
      setIsTestingConnection(false);
      return;
    }

    try {
      const kimiAPI = new KimiTherapyAPI(config.apiKey, config.apiUrl);
      const result = await kimiAPI.testConnection();
      
      if (result.success) {
        setConnectionStatus({ 
          success: true, 
          message: 'Connection to Kimi K2 successful! Ready for mental health conversations.' 
        });
      } else {
        setConnectionStatus({ 
          success: false, 
          message: result.error || 'Failed to connect to Moonshot AI API. Please check your API key.' 
        });
      }
    } catch (error) {
      setConnectionStatus({ 
        success: false, 
        message: `Connection failed: ${error.message}` 
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = () => {
    onConfigSaved(config);
    onClose();
  };

  const currentProvider = providers[config.provider];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-5/6 overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">AI</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">AI Model Configuration</h2>
              <p className="text-sm text-gray-500">Configure your AI therapy assistant</p>
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
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-800">Enable AI Assistant</h3>
              <p className="text-sm text-gray-500">Use AI for personalized therapy responses</p>
            </div>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => handleConfigChange('enabled', e.target.checked)}
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
          </div>

          {config.enabled && (
            <>
              {/* Kimi K2 Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">AI Model: Kimi K2</h3>
                <div className="border border-purple-500 bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">K2</span>
                    </div>
                    <h4 className="font-medium text-gray-800">Kimi K2-Instruct (Moonshot AI)</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    State-of-the-art MoE model with 1T parameters, specifically designed for agentic intelligence. 
                    Exceptional performance in reasoning, coding, and conversational tasks - perfect for mental health applications.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded">
                      <span className="font-medium">Parameters:</span> 1T total, 32B active
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="font-medium">Context:</span> 128K tokens
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="font-medium">Specialty:</span> Agentic AI
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="font-medium">Optimized:</span> Tool use & reasoning
                    </div>
                  </div>
                </div>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <select
                  value={config.model}
                  onChange={(e) => handleConfigChange('model', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {currentProvider.models.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* API Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">API Configuration</h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">API URL</label>
                  <input
                    type="url"
                    value={config.apiUrl}
                    onChange={(e) => handleConfigChange('apiUrl', e.target.value)}
                    placeholder={currentProvider.apiUrlPlaceholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Moonshot AI API Key</label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={config.apiKey}
                      onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Get your API key from <a href="https://platform.moonshot.ai" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">platform.moonshot.ai</a>
                  </p>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Advanced Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Temperature ({config.temperature}) - Recommended: 0.6
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.temperature}
                      onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">Kimi K2 works best at 0.6 for therapeutic conversations</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Max Tokens</label>
                    <input
                      type="number"
                      value={config.maxTokens}
                      onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
                      min="100"
                      max="4000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500">Maximum response length</p>
                  </div>
                </div>
              </div>

              {/* Connection Test */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-800">Test Connection</h3>
                  <button
                    onClick={testConnection}
                    disabled={isTestingConnection || !config.apiKey}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTestingConnection ? 'Testing Kimi K2...' : 'Test Kimi K2 Connection'}
                  </button>
                </div>
                
                {connectionStatus && (
                  <div className={`p-3 rounded-md ${
                    connectionStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {connectionStatus.message}
                  </div>
                )}
              </div>

              {/* Setup Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Kimi K2 Setup Instructions</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Visit <a href="https://platform.moonshot.ai" className="underline" target="_blank" rel="noopener noreferrer">platform.moonshot.ai</a> to create an account</li>
                  <li>Generate your API key from the platform dashboard</li>
                  <li>Enter your API key above and test the connection</li>
                  <li>Kimi K2 is now ready for intelligent therapy conversations!</li>
                </ol>
                <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
                  <strong>Why Kimi K2?</strong> Exceptional at agentic tasks, reasoning, and understanding complex emotional contexts - ideal for mental health applications.
                </div>
              </div>
            </>
          )}

          {/* Privacy Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 font-bold">!</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Privacy & Security Notice</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  When using Kimi K2, your conversations are sent to Moonshot AI's servers. 
                  Please review their privacy policy at platform.moonshot.ai. All communications are encrypted in transit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
} 