import React from 'react';
import { Feature, StepProps } from '@/types';
import { FEATURE_OPTIONS, PLATFORMS } from '@/types/constants';
import { useWizard } from '@/contexts/WizardContext';
import Button from '@/components/shared/Button';
import Card, { CardContent, CardDescription, CardTitle } from '@/components/shared/Card';
import Alert from '@/components/shared/Alert';
import { ArrowLeft, Info } from 'lucide-react';

const Step3Features: React.FC<StepProps> = ({ onNext, onPrevious, onSkip }) => {
  const { state, actions } = useWizard();
  
  const handleFeatureToggle = (feature: Feature) => {
    const currentFeatures = state.features;
    const isSelected = currentFeatures.includes(feature);
    
    if (isSelected) {
      // Remove if already selected
      actions.setFeatures(currentFeatures.filter(f => f !== feature));
    } else {
      // Add feature
      actions.setFeatures([...currentFeatures, feature]);
    }
  };

  const handleSelectAll = () => {
    if (state.platform) {
      const platformConfig = PLATFORMS[state.platform];
      const supportedFeatures = FEATURE_OPTIONS
        .filter(option => platformConfig.supportedFeatures.includes(option.value))
        .map(option => option.value);
      actions.setFeatures(supportedFeatures);
    }
  };

  const handleClearAll = () => {
    actions.setFeatures([]);
  };

  const validation = actions.validateCurrentStep();
  const selectedCount = state.features.length;
  
  // Get platform-specific info
  const platformConfig = state.platform ? PLATFORMS[state.platform] : null;
  const supportedFeatures = platformConfig?.supportedFeatures || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Features
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Select additional features to enhance your chat session management system.
        </p>
        
        {/* Selection Counter and Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-sm font-medium text-gray-700">
              Selected: {selectedCount} feature{selectedCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleSelectAll}
              variant="outline"
              size="sm"
              disabled={!platformConfig}
            >
              Select All Supported
            </Button>
            <Button
              onClick={handleClearAll}
              variant="outline"
              size="sm"
              disabled={selectedCount === 0}
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Platform Compatibility Info */}
      {platformConfig && (
        <Alert type="info" className="mb-6">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Platform Compatibility</p>
              <p className="text-sm mt-1">
                {platformConfig.displayName} supports {supportedFeatures.length} out of {FEATURE_OPTIONS.length} available features.
                Features not supported by your platform will be shown as disabled.
              </p>
            </div>
          </div>
        </Alert>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURE_OPTIONS.map((option) => {
          const isSelected = state.features.includes(option.value);
          const isSupported = !platformConfig || supportedFeatures.includes(option.value);
          
          return (
            <Card
              key={option.value}
              selected={isSelected}
              onClick={isSupported ? () => handleFeatureToggle(option.value) : undefined}
              hover={isSupported}
              disabled={!isSupported}
              className="h-full relative"
            >
              <CardContent>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl flex-shrink-0" role="img" aria-label={option.label}>
                    {option.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle level={4} className={`text-base ${!isSupported ? 'text-gray-400' : ''}`}>
                          {option.label}
                        </CardTitle>
                        <CardDescription className={`mt-2 ${!isSupported ? 'text-gray-400' : ''}`}>
                          {option.description}
                        </CardDescription>
                      </div>
                      
                      {/* Status Badges */}
                      <div className="flex flex-col items-end space-y-1 ml-2">
                        {isSelected && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            ✓ Selected
                          </span>
                        )}
                        
                        {!isSupported && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            Not Supported
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Disabled Overlay */}
                {!isSupported && (
                  <div className="absolute inset-0 bg-gray-50 bg-opacity-50 rounded-lg pointer-events-none" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">🤖 AI & Automation</h4>
          <p className="text-sm text-green-600">
            AI Integration, Custom Commands
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">🔗 Integration</h4>
          <p className="text-sm text-blue-600">
            Webhooks, File Attachments
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2">🧠 Intelligence</h4>
          <p className="text-sm text-purple-600">
            Context Awareness, Conversation Branching
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-medium text-orange-800 mb-2">🌍 Global</h4>
          <p className="text-sm text-orange-600">
            Multi-language, Backup & Restore
          </p>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedCount > 0 && (
        <Alert type="success">
          <p>
            Great! You've selected {selectedCount} feature{selectedCount !== 1 ? 's' : ''}.
            You can continue to configure your team settings, or add/remove features as needed.
          </p>
        </Alert>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onPrevious}
          variant="outline"
          size="lg"
          icon={<ArrowLeft />}
        >
          Previous
        </Button>
        
        <div className="flex space-x-3">
          {onSkip && (
            <Button
              onClick={onSkip}
              variant="ghost"
              size="lg"
            >
              Skip Features
            </Button>
          )}
          
          <Button
            onClick={onNext}
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

export default Step3Features;