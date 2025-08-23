import React from 'react';
import { StepProps } from '@/types';
import { useWizard } from '@/contexts/WizardContext';
import Button from '@/components/shared/Button';
import Card, { CardContent, CardDescription, CardTitle, CardHeader } from '@/components/shared/Card';
import { CheckCircle, Star, Github, BookOpen, MessageSquare, Repeat, Download, ExternalLink } from 'lucide-react';

const Step8Complete: React.FC<StepProps> = ({ onPrevious }) => {
  const { state, actions } = useWizard();
  
  const solution = state.generatedSolution;
  if (!solution) return null;

  const handleStartOver = () => {
    actions.resetWizard();
  };

  const handleDownloadSummary = () => {
    const summary = {
      projectName: state.projectName,
      description: state.description,
      platform: state.platform,
      priorities: state.priorities,
      features: state.features,
      teamSize: state.teamSize,
      complexity: state.complexity,
      estimatedTime: solution.estimatedTime,
      totalFiles: solution.files.length,
      setupInstructions: solution.setupInstructions,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.projectName}-summary.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const achievements = [
    { icon: '🎯', title: 'Platform Selected', description: `Chose ${solution.platform}` },
    { icon: '⚡', title: 'Priorities Set', description: `Configured ${state.priorities.length} priorities` },
    { icon: '✨', title: 'Features Added', description: `Selected ${state.features.length} features` },
    { icon: '🏗️', title: 'Project Configured', description: `${state.complexity} complexity level` },
    { icon: '📦', title: 'Solution Generated', description: `${solution.files.length} files created` },
    { icon: '🚀', title: 'Ready to Deploy', description: 'Complete setup instructions provided' },
  ];

  const nextSteps = [
    {
      title: 'Start Development',
      description: 'Follow the setup instructions to get your project running locally',
      icon: <BookOpen className="w-5 h-5" />,
      action: 'Follow setup guide'
    },
    {
      title: 'Customize Your Solution',
      description: 'Modify the generated code to match your specific requirements',
      icon: <MessageSquare className="w-5 h-5" />,
      action: 'Customize code'
    },
    {
      title: 'Deploy to Production',
      description: 'Use the included Docker configuration for easy deployment',
      icon: <ExternalLink className="w-5 h-5" />,
      action: 'Deploy project'
    },
  ];

  const resources = [
    {
      title: 'Documentation',
      description: 'Complete README and setup guides included in your project',
      url: '#readme',
    },
    {
      title: 'Community',
      description: 'Join our Discord community for help and discussions',
      url: '#community',
    },
    {
      title: 'Examples',
      description: 'Browse example projects and implementations',
      url: '#examples',
    },
    {
      title: 'Support',
      description: 'Get help with implementation and troubleshooting',
      url: '#support',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Congratulations! 🎉
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          Your <span className="font-semibold text-primary-600">{state.projectName}</span> chat session management system is ready!
        </p>
        <p className="text-gray-500">
          We've generated a complete {solution.platform} solution with all your selected features.
        </p>
      </div>

      {/* Achievement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle level={3}>Project Summary</CardTitle>
          <CardDescription>
            Overview of your generated chat session management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Platform & Configuration</h4>
                <div className="mt-1 space-y-1 text-sm text-gray-600">
                  <p><strong>Platform:</strong> {solution.platform}</p>
                  <p><strong>Complexity:</strong> {state.complexity}</p>
                  <p><strong>Team Size:</strong> {state.teamSize}</p>
                  <p><strong>Setup Time:</strong> {solution.estimatedTime}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700">Generated Output</h4>
                <div className="mt-1 space-y-1 text-sm text-gray-600">
                  <p><strong>Total Files:</strong> {solution.files.length}</p>
                  <p><strong>Source Files:</strong> {solution.files.filter(f => f.type === 'source').length}</p>
                  <p><strong>Config Files:</strong> {solution.files.filter(f => f.type === 'config').length}</p>
                  <p><strong>Documentation:</strong> {solution.files.filter(f => f.type === 'documentation').length}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Core Priorities</h4>
                <div className="mt-1 space-y-1">
                  {state.priorities.map((priority) => (
                    <span key={priority} className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                      {priority.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
              
              {state.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Additional Features</h4>
                  <div className="mt-1 space-y-1">
                    {state.features.map((feature) => (
                      <span key={feature} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                        {feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle level={3}>What's Next?</CardTitle>
          <CardDescription>
            Recommended next steps to get your chat system running
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{step.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-sm text-primary-600 font-medium">{step.action} →</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle level={3}>Resources & Support</CardTitle>
          <CardDescription>
            Helpful resources to support your development journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">{resource.title}</h4>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={handleDownloadSummary}
          variant="outline"
          size="lg"
          icon={<Download />}
        >
          Download Project Summary
        </Button>
        
        <Button
          onClick={handleStartOver}
          variant="outline"
          size="lg"
          icon={<Repeat />}
        >
          Create Another Project
        </Button>
      </div>

      {/* Thank You Message */}
      <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <CardContent className="text-center py-8">
          <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You for Using Our Builder!</h3>
          <p className="text-gray-600 mb-4">
            We hope this tool helps you build amazing chat experiences. 
            If you found it useful, consider giving us a star on GitHub!
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="sm" icon={<Github />}>
              Star on GitHub
            </Button>
            <Button variant="outline" size="sm" icon={<MessageSquare />}>
              Share Feedback
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Final Note */}
      <div className="text-center text-sm text-gray-500">
        <p>Built with ❤️ for developers who love creating great chat experiences</p>
        <p className="mt-1">Need help? Join our community or check the documentation included in your project.</p>
      </div>
    </div>
  );
};

export default Step8Complete;