import React from 'react';
import { StepProps } from '@/types';
import { PLATFORMS, PRIORITY_OPTIONS, FEATURE_OPTIONS, TEAM_SIZE_OPTIONS, COMPLEXITY_OPTIONS } from '@/types/constants';
import { useWizard } from '@/contexts/WizardContext';
import Button from '@/components/shared/Button';
import Card, { CardContent, CardDescription, CardTitle, CardHeader } from '@/components/shared/Card';
import Alert from '@/components/shared/Alert';
import { ArrowLeft, Clock, Users, Zap, Settings, FileText, CheckCircle, Edit3 } from 'lucide-react';

const Step5Review: React.FC<StepProps> = ({ onNext, onPrevious }) => {
  const { state, actions } = useWizard();
  
  const platformConfig = state.platform ? PLATFORMS[state.platform] : null;
  const selectedPriorities = PRIORITY_OPTIONS.filter(opt => state.priorities.includes(opt.value));
  const selectedFeatures = FEATURE_OPTIONS.filter(opt => state.features.includes(opt.value));
  const teamSizeOption = TEAM_SIZE_OPTIONS.find(opt => opt.value === state.teamSize);
  const complexityOption = COMPLEXITY_OPTIONS.find(opt => opt.value === state.complexity);

  const handleEditSection = (step: number) => {
    actions.goToStep(step);
  };

  // Calculate estimated setup time based on selections
  const getEstimatedTime = () => {
    if (!platformConfig) return 'Unknown';
    
    const baseHours = {
      'basic': 2,
      'intermediate': 4,
      'advanced': 6,
      'expert': 8
    }[state.complexity || 'basic'];
    
    const featureMultiplier = 1 + (state.features.length * 0.1);
    const teamMultiplier = {
      'solo': 1,
      'small': 0.8,
      'medium': 0.6,
      'large': 0.5,
      'enterprise': 0.4
    }[state.teamSize || 'solo'];
    
    const totalHours = Math.ceil(baseHours * featureMultiplier * teamMultiplier);
    
    if (totalHours < 2) return '1-2 hours';
    if (totalHours < 4) return '2-4 hours';
    if (totalHours < 8) return '4-8 hours';
    return '8+ hours';
  };

  const validation = actions.validateCurrentStep();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Review Your Configuration
        </h2>
        <p className="text-lg text-gray-600">
          Please review your selections before generating your chat session management solution.
        </p>
      </div>

      {/* Configuration Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Platform Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">{platformConfig?.icon}</div>
                <CardTitle level={3}>Platform</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditSection(1)}
                icon={<Edit3 />}
              >
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">{platformConfig?.displayName}</h4>
                <CardDescription>{platformConfig?.description}</CardDescription>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{platformConfig?.estimatedTime}</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  <span className="capitalize">{platformConfig?.complexity}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priorities Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle level={3}>Priorities ({state.priorities.length})</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditSection(2)}
                icon={<Edit3 />}
              >
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedPriorities.map((priority) => (
                <div key={priority.value} className="flex items-center space-x-2">
                  <span className="text-lg">{priority.icon}</span>
                  <span className="text-sm font-medium">{priority.label}</span>
                  {priority.recommended && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                      Recommended
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle level={3}>Features ({state.features.length})</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditSection(3)}
                icon={<Edit3 />}
              >
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {state.features.length > 0 ? (
              <div className="space-y-2">
                {selectedFeatures.map((feature) => (
                  <div key={feature.value} className="flex items-center space-x-2">
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-sm font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <CardDescription>No additional features selected</CardDescription>
            )}
          </CardContent>
        </Card>

        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle level={3}>Configuration</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditSection(4)}
                icon={<Edit3 />}
              >
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Team:</span>
                <span className="text-sm">{teamSizeOption?.label}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Complexity:</span>
                <span className="text-sm">{complexityOption?.label}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Est. Time:</span>
                <span className="text-sm">{getEstimatedTime()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <CardTitle level={3}>Project Information</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditSection(4)}
              icon={<Edit3 />}
            >
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-700">Project Name:</span>
              <p className="text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded mt-1">
                {state.projectName}
              </p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-700">Description:</span>
              <p className="text-gray-900 mt-1">
                {state.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Preview */}
      <Alert type="info" title="What You'll Get">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">Generated Files:</h4>
            <ul className="space-y-1">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Complete source code
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Configuration files
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Package.json with dependencies
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Documentation & README
              </li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Setup Options:</h4>
            <ul className="space-y-1">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                Download as ZIP
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                Copy to clipboard
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                Auto-setup (optional)
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                Step-by-step instructions
              </li>
            </ul>
          </div>
        </div>
      </Alert>

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
          <Button
            onClick={onNext}
            variant="primary"
            size="lg"
            icon={<Settings />}
          >
            Generate Solution
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step5Review;