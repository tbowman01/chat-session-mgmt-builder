import React from 'react';
import { TeamSize, Complexity, StepProps } from '@/types';
import { TEAM_SIZE_OPTIONS, COMPLEXITY_OPTIONS, VALIDATION_RULES } from '@/types/constants';
import { useWizard } from '@/contexts/WizardContext';
import Button from '@/components/shared/Button';
import Card, { CardContent, CardDescription, CardTitle } from '@/components/shared/Card';
import Alert from '@/components/shared/Alert';
import { ArrowLeft, Users, Zap, FileText } from 'lucide-react';

const Step4Configuration: React.FC<StepProps> = ({ onNext, onPrevious }) => {
  const { state, actions } = useWizard();
  
  const handleTeamSizeSelect = (teamSize: TeamSize) => {
    actions.setTeamSize(teamSize);
  };

  const handleComplexitySelect = (complexity: Complexity) => {
    actions.setComplexity(complexity);
  };

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.setProjectName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    actions.setDescription(e.target.value);
  };

  const validation = actions.validateCurrentStep();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Project Configuration
        </h2>
        <p className="text-lg text-gray-600">
          Configure your team size, project complexity, and provide basic project information.
        </p>
      </div>

      {/* Team Size Selection */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">Team Size</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {TEAM_SIZE_OPTIONS.map((option) => {
            const isSelected = state.teamSize === option.value;
            
            return (
              <Card
                key={option.value}
                selected={isSelected}
                onClick={() => handleTeamSizeSelect(option.value)}
                hover
                className="text-center"
              >
                <CardContent className="p-4">
                  <div className="text-3xl mb-2" role="img" aria-label={option.label}>
                    {option.icon}
                  </div>
                  <CardTitle level={4} className="text-sm font-medium">
                    {option.label}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {option.description}
                  </CardDescription>
                  
                  {isSelected && (
                    <div className="mt-2 text-xs font-medium text-primary-600">
                      ✓ Selected
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Complexity Selection */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="w-5 h-5 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">Complexity Level</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPLEXITY_OPTIONS.map((option) => {
            const isSelected = state.complexity === option.value;
            
            return (
              <Card
                key={option.value}
                selected={isSelected}
                onClick={() => handleComplexitySelect(option.value)}
                hover
                className="text-center"
              >
                <CardContent className="p-4">
                  <div className="text-3xl mb-2" role="img" aria-label={option.label}>
                    {option.icon}
                  </div>
                  <CardTitle level={4} className="text-sm font-medium">
                    {option.label}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {option.description}
                  </CardDescription>
                  
                  {isSelected && (
                    <div className="mt-2 text-xs font-medium text-primary-600">
                      ✓ Selected
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Project Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">Project Information</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              id="projectName"
              value={state.projectName}
              onChange={handleProjectNameChange}
              placeholder="e.g., my-chat-bot, customer-support-system"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              maxLength={VALIDATION_RULES.PROJECT_NAME.MAX_LENGTH}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>
                {state.projectName.length < VALIDATION_RULES.PROJECT_NAME.MIN_LENGTH 
                  ? `Minimum ${VALIDATION_RULES.PROJECT_NAME.MIN_LENGTH} characters`
                  : 'Good!'
                }
              </span>
              <span>
                {state.projectName.length}/{VALIDATION_RULES.PROJECT_NAME.MAX_LENGTH}
              </span>
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              value={state.description}
              onChange={handleDescriptionChange}
              placeholder="Briefly describe what your chat system will do..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              maxLength={VALIDATION_RULES.DESCRIPTION.MAX_LENGTH}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>
                {state.description.length < VALIDATION_RULES.DESCRIPTION.MIN_LENGTH 
                  ? `Minimum ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} characters`
                  : 'Good!'
                }
              </span>
              <span>
                {state.description.length}/{VALIDATION_RULES.DESCRIPTION.MAX_LENGTH}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Preview */}
      {(state.teamSize || state.complexity) && (
        <Alert type="info" title="Configuration Preview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {state.teamSize && (
              <div>
                <span className="font-medium">Team Size:</span>
                <span className="ml-1">
                  {TEAM_SIZE_OPTIONS.find(opt => opt.value === state.teamSize)?.label}
                </span>
              </div>
            )}
            
            {state.complexity && (
              <div>
                <span className="font-medium">Complexity:</span>
                <span className="ml-1">
                  {COMPLEXITY_OPTIONS.find(opt => opt.value === state.complexity)?.label}
                </span>
              </div>
            )}
          </div>
          
          {state.teamSize === 'enterprise' && state.complexity === 'expert' && (
            <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-sm text-yellow-800">
                ⚡ This configuration will generate a comprehensive, production-ready solution with advanced enterprise features.
              </p>
            </div>
          )}
        </Alert>
      )}

      {/* Validation Errors */}
      {!validation.isValid && (
        <Alert type="error" title="Please complete the following:">
          <ul className="space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-center text-sm">
                <div className="w-1 h-1 bg-red-400 rounded-full mr-2 flex-shrink-0" />
                {error}
              </li>
            ))}
          </ul>
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
          <Button
            onClick={onNext}
            disabled={!validation.isValid}
            variant="primary"
            size="lg"
          >
            Review Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step4Configuration;