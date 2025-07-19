import React, { useState } from 'react';

export default function ProgressTracker({ sessionData, onClose }) {
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [selectedMetric, setSelectedMetric] = useState('mood');
  
  // Mock data - in real app this would come from session storage/database
  const [progressData] = useState({
    moodTrends: {
      week: [6, 7, 5, 8, 6, 7, 8],
      month: [6.5, 6.8, 7.2, 6.9, 7.5, 7.8, 8.1, 7.6],
      labels: {
        week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        month: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8']
      }
    },
    sessionInsights: {
      totalSessions: 12,
      averageSessionLength: 28, // minutes
      preferredFramework: 'CBT',
      mostCommonEmotions: ['anxiety', 'sadness', 'hope'],
      improvementAreas: ['thought challenging', 'emotional regulation', 'mindfulness practice']
    },
    wellnessMetrics: {
      sleepQuality: 7.2,
      stressLevel: 4.1, // out of 10, lower is better
      socialConnection: 6.8,
      physicalActivity: 5.9,
      mindfulnessPractice: 8.1
    },
    goals: [
      { id: 1, title: 'Practice daily mindfulness', progress: 75, target: 'Daily', status: 'on_track' },
      { id: 2, title: 'Challenge negative thoughts', progress: 60, target: '3x/week', status: 'on_track' },
      { id: 3, title: 'Improve sleep routine', progress: 45, target: '8hrs/night', status: 'needs_attention' },
      { id: 4, title: 'Social activities', progress: 30, target: '2x/week', status: 'behind' }
    ],
    recentBreakthroughs: [
      {
        date: '2024-01-15',
        insight: 'Recognized the connection between morning anxiety and coffee intake',
        framework: 'CBT',
        impact: 'high'
      },
      {
        date: '2024-01-12',
        insight: 'Successfully used TIPP skill during panic episode',
        framework: 'DBT',
        impact: 'high'
      },
      {
        date: '2024-01-08',
        insight: 'Identified core value of family connection driving motivation',
        framework: 'ACT',
        impact: 'medium'
      }
    ]
  });

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'mood':
        return progressData.moodTrends[timeRange];
      case 'stress':
        return timeRange === 'week' ? [8, 6, 7, 4, 5, 3, 4] : [7.2, 6.8, 6.1, 5.9, 5.2, 4.8, 4.5, 4.1];
      case 'sleep':
        return timeRange === 'week' ? [6, 7, 8, 7, 6, 8, 9] : [6.5, 7.1, 7.4, 7.2, 7.6, 7.8, 7.9, 8.1];
      default:
        return progressData.moodTrends[timeRange];
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_track': return 'text-green-600 bg-green-100';
      case 'needs_attention': return 'text-yellow-600 bg-yellow-100';
      case 'behind': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'border-l-green-400 bg-green-50';
      case 'medium': return 'border-l-yellow-400 bg-yellow-50';
      case 'low': return 'border-l-blue-400 bg-blue-50';
      default: return 'border-l-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Progress Tracker</h2>
            <p className="text-sm text-gray-600 mt-1">Your mental wellness journey insights</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Trends & Metrics */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Mood/Wellness Trends Chart */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Wellness Trends</h3>
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-1"
                  >
                    <option value="mood">Mood</option>
                    <option value="stress">Stress Level</option>
                    <option value="sleep">Sleep Quality</option>
                  </select>
                </div>
                
                {/* Simple Chart Visualization */}
                <div className="space-y-4">
                  <div className="flex items-end gap-2 h-32">
                    {getMetricData().map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-blue-400 rounded-t-sm transition-all duration-300"
                          style={{ height: `${(value / 10) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-2">
                          {progressData.moodTrends.labels[timeRange][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 (Poor)</span>
                    <span className="font-medium">
                      {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Scale
                    </span>
                    <span>10 (Excellent)</span>
                  </div>
                </div>
              </div>

              {/* Session Insights */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Session Insights</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{progressData.sessionInsights.totalSessions}</div>
                    <div className="text-sm text-gray-600">Total Sessions</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{progressData.sessionInsights.averageSessionLength}m</div>
                    <div className="text-sm text-gray-600">Avg Session Length</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700">Preferred Framework</div>
                    <div className="text-blue-600">{progressData.sessionInsights.preferredFramework}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700">Common Emotions</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {progressData.sessionInsights.mostCommonEmotions.map((emotion, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Breakthroughs */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Breakthroughs</h3>
                
                <div className="space-y-3">
                  {progressData.recentBreakthroughs.map((breakthrough, index) => (
                    <div key={index} className={`border-l-4 p-4 rounded ${getImpactColor(breakthrough.impact)}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-500">{breakthrough.date}</span>
                        <div className="flex gap-2">
                          <span className="text-xs bg-white bg-opacity-70 px-2 py-1 rounded">
                            {breakthrough.framework}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            breakthrough.impact === 'high' ? 'bg-green-200 text-green-800' :
                            breakthrough.impact === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-blue-200 text-blue-800'
                          }`}>
                            {breakthrough.impact} impact
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{breakthrough.insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Goals & Wellness Metrics */}
            <div className="space-y-6">
              
              {/* Goals Progress */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Goals Progress</h3>
                
                <div className="space-y-4">
                  {progressData.goals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(goal.status)}`}>
                          {goal.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{goal.progress}% complete</span>
                        <span>{goal.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wellness Metrics */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Wellness Metrics</h3>
                
                <div className="space-y-4">
                  {Object.entries(progressData.wellnessMetrics).map(([metric, value]) => (
                    <div key={metric} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 capitalize">
                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(value / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-800 w-8">
                          {value.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-sm font-medium text-gray-700">Export Progress Report</div>
                    <div className="text-xs text-gray-500">Download detailed PDF summary</div>
                  </button>
                  
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-sm font-medium text-gray-700">Set New Goal</div>
                    <div className="text-xs text-gray-500">Create personalized wellness goal</div>
                  </button>
                  
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-sm font-medium text-gray-700">Schedule Check-in</div>
                    <div className="text-xs text-gray-500">Book follow-up session</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 