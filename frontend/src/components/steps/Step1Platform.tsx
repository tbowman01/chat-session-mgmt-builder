import React from 'react';
import { Platform, StepProps } from '@/types';
import { PLATFORM_OPTIONS, PLATFORMS } from '@/types/constants';
import { useWizard } from '@/contexts/WizardContext';
import Button from '@/components/shared/Button';
import Card, { CardContent, CardDescription, CardTitle } from '@/components/shared/Card';
import { Clock, Users, Zap } from 'lucide-react';

const Step1Platform: React.FC<StepProps> = ({ onNext, onPrevious }) => {
  const { state, actions } = useWizard();
  
  const handlePlatformSelect = (platform: Platform) => {
    actions.setPlatform(platform);
  };

  const validation = actions.validateCurrentStep();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Platform
        </h2>
        <p className="text-lg text-gray-600">
          Select the platform where you want to build your chat session management solution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLATFORM_OPTIONS.map((option) => {
          const platformConfig = PLATFORMS[option.value];
          const isSelected = state.platform === option.value;
          
          return (
            <Card
              key={option.value}
              selected={isSelected}
              onClick={() => handlePlatformSelect(option.value)}
              hover
              className="h-full"
            >
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3" role="img" aria-label={option.label}>
                    {option.icon}
                  </div>
                  <CardTitle level={3}>{option.label}</CardTitle>
                  <CardDescription className="mt-2">
                    {option.description}
                  </CardDescription>
                </div>
                
                {/* Platform Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{platformConfig.estimatedTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Zap className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="capitalize">{platformConfig.complexity} complexity</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{platformConfig.supportedFeatures.length} supported features</span>
                  </div>
                </div>

                {/* Requirements */}
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {platformConfig.requirements.map((req, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="mt-4 p-2 bg-primary-50 rounded-lg">
                    <div className="text-sm font-medium text-primary-700 text-center">
                      ✓ Selected
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Popular Platforms Highlight */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Popular Choices</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Beginners:</span>
            <span className="text-blue-700 ml-1">Telegram Bot, CLI Tool</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Enterprise:</span>
            <span className="text-blue-700 ml-1">Slack App, Web Chat</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Gaming:</span>
            <span className="text-blue-700 ml-1">Discord Bot</span>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {!validation.isValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Please complete this step:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-center">
                <div className="w-1 h-1 bg-red-400 rounded-full mr-2 flex-shrink-0" />
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <div>
          {/* First step, no previous button */}
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={onNext}
            disabled={!validation.isValid}
            variant="primary"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step1Platform;