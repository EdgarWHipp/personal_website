// Configuration Manager for Kimi K2 Integration
class ConfigManager {
  constructor() {
    this.storageKey = 'bwell_ai_config';
  }

  // Get configuration from environment variables or local storage
  getAIConfig() {
    // Configuration from environment variables
    const envConfig = {
      apiKey: process.env.REACT_APP_MOONSHOT_KEY,
      apiUrl: process.env.REACT_APP_KIMI_API_URL,
      model: 'moonshot-v1-8k',
      temperature: 0.3,
      maxTokens: 1000,
      provider: 'kimi',
      enabled: !!process.env.REACT_APP_MOONSHOT_KEY
    };
   
    // Debug logging for API key loading - removed for production

    // Then check local storage (user overrides)
    try {
      const savedConfig = localStorage.getItem(this.storageKey);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        return {
          ...envConfig,
          ...parsed,
          // If user has saved config, enable AI
          enabled: parsed.enabled !== undefined ? parsed.enabled : !!parsed.apiKey
        };
      }
    } catch (error) {
      // Error reading AI config from localStorage
    }

    // Return env config with enabled based on whether API key exists
    return {
      ...envConfig,
      enabled: !!envConfig.apiKey
    };
  }

  // Save configuration to local storage
  saveAIConfig(config) {
    try {
      // Don't save empty or undefined values
      const cleanConfig = Object.entries(config).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      localStorage.setItem(this.storageKey, JSON.stringify(cleanConfig));
      return true;
    } catch (error) {
      // Error saving AI config to localStorage
      return false;
    }
  }

  // Clear configuration
  clearAIConfig() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      // Error clearing AI config
      return false;
    }
  }

  // Validate configuration
  validateConfig(config) {
    const errors = [];

    if (!config.apiKey || config.apiKey.length < 10) {
      errors.push('Valid API key is required');
    }

    if (!config.apiUrl || !this.isValidUrl(config.apiUrl)) {
      errors.push('Valid API URL is required');
    }

    if (config.temperature < 0 || config.temperature > 1) {
      errors.push('Temperature must be between 0 and 1');
    }

    if (config.maxTokens < 50 || config.maxTokens > 4000) {
      errors.push('Max tokens must be between 50 and 4000');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper method to validate URLs
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Get ElevenLabs configuration
  getElevenLabsConfig() {
    return {
      apiKey: process.env.REACT_APP_ELEVENLABS_API_KEY,
      enabled: !!process.env.REACT_APP_ELEVENLABS_API_KEY
    };
  }

  // Get crisis support configuration
  getCrisisConfig() {
    return {
      hotline: process.env.REACT_APP_CRISIS_HOTLINE || '988',
      textLine: process.env.REACT_APP_CRISIS_TEXT || '741741',
      emergency: '911'
    };
  }
}

// Export singleton instance
const configManager = new ConfigManager();
export default configManager; 