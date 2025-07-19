import researchPaperService from './researchPaperService';

class KimiTherapyAPI {
  constructor(apiKey, baseUrl = 'https://api.moonshot.cn/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  }

  async sendMessage(messages, temperature = 0.6, maxTokens = 1000) {
    try {

      // Get relevant research context based on conversation
      const researchContext = researchPaperService.getResearchContext(messages, 1500);

      const systemContent = `You are Kimi, an AI assistant created by Moonshot AI, specially configured as a mental wellness support companion. You provide empathetic, evidence-based mental health support using therapeutic frameworks like CBT, DBT, ACT, and mindfulness-based interventions.${researchContext.hasResearch ? researchContext.context : ''}`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: 'moonshot-v1-32k',
          messages: [
            {
              role: 'system',
              content: systemContent + `

Key Guidelines:
- Always prioritize user safety and well-being
- Use active listening and validation techniques  
- Ask thoughtful, open-ended questions to encourage reflection
- Provide practical coping strategies when appropriate
- Recognize signs of crisis and direct to professional help
- Maintain appropriate boundaries as an AI assistant
- Use warm, non-judgmental language
- Encourage professional help for serious mental health concerns
- Draw from evidence-based therapeutic approaches
- Be culturally sensitive and inclusive
- Validate emotions while promoting healthy coping

Response Style:
- Be empathetic and warm
- Use "I" statements to show engagement
- Ask follow-up questions to encourage exploration
- Offer specific, actionable suggestions when appropriate
- Acknowledge the user's courage in seeking support

Remember: You are a supportive tool, not a replacement for professional therapy. In crisis situations, always direct users to immediate professional help.`
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            }))
          ],
          temperature: temperature,
          max_tokens: maxTokens,
          stream: false
        })
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Kimi API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      return {
        success: true,
        message: data.choices[0].message.content,
        usage: data.usage,
        model: 'moonshot-v1-32k'
      };

    } catch (error) {
      
      // Enhanced error handling with specific user guidance
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return {
          success: false,
          error: 'Invalid API key. Please check your Moonshot AI API key configuration.',
          fallbackMessage: "I'm having trouble connecting to my AI service. It looks like there might be an issue with the API key configuration. You can update this in the AI settings. In the meantime, I'm here in demo mode to support you."
        };
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please wait a moment before trying again.',
          fallbackMessage: "I need a moment to process due to high usage. Please try sending your message again in a few seconds. I'm still here to support you."
        };
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Network connection issue.',
          fallbackMessage: "I'm having trouble connecting to the internet right now. Please check your connection and try again. If you're in crisis, please reach out to professional support services immediately."
        };
      } else {
        return {
          success: false,
          error: error.message,
          fallbackMessage: "I'm experiencing some technical difficulties. While I work through this, please remember that if you're in crisis, you can reach out to professional support services: National Suicide Prevention Lifeline (988) or Emergency Services (911)."
        };
      }
    }
  }

  async testConnection() {
    try {
      const testMessages = [{
        sender: 'user',
        text: 'Hello, can you confirm you are working?'
      }];

      const result = await this.sendMessage(testMessages, 0.3, 50);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        fallbackMessage: 'Connection test failed'
      };
    }
  }

  // Crisis detection keywords - expand this list based on your needs
  detectCrisisKeywords(message) {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm',
      'overdose', 'cutting', 'die', 'death', 'hopeless', 'worthless',
      'crisis', 'emergency', 'urgent help'
    ];

    const text = message.toLowerCase();
    return crisisKeywords.some(keyword => text.includes(keyword));
  }

  getCrisisResponse() {
    return {
      success: true,
      message: `I'm really concerned about what you're sharing with me. Your life has value, and there are people who want to help you through this difficult time.

🚨 **Immediate Support Available:**
• **National Suicide Prevention Lifeline**: 988 (24/7)
• **Crisis Text Line**: Text HOME to 741741
• **Emergency Services**: 911

Please reach out to one of these resources right now. You don't have to go through this alone, and there are trained professionals ready to support you.

Would you like me to help you think through some immediate safety steps while you're waiting to connect with professional support?`,
      isCrisisResponse: true
    };
  }

  // Simple language learning API call (bypasses therapy configuration)
  async generateLanguageLesson(prompt, temperature = 0.7, maxTokens = 500) {
    try {

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: 'moonshot-v1-32k',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: temperature,
          max_tokens: maxTokens,
          stream: false
        })
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Kimi API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      return {
        success: true,
        message: data.choices[0].message.content,
        usage: data.usage,
        model: 'moonshot-v1-32k'
      };

    } catch (error) {
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return {
          success: false,
          error: 'Invalid API key. Please check your Moonshot AI API key configuration.',
          fallbackMessage: "API key authentication failed. Please verify your Moonshot AI API key."
        };
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please wait a moment before trying again.',
          fallbackMessage: "Rate limit reached. Please try again in a few seconds."
        };
      } else {
        return {
          success: false,
          error: error.message,
          fallbackMessage: "Language lesson generation failed: " + error.message
        };
      }
    }
  }
}

export default KimiTherapyAPI; 