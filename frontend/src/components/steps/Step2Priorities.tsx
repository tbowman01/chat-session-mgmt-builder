import React from 'react';
import { Priority, StepProps } from '@/types';
import { PRIORITY_OPTIONS, VALIDATION_RULES } from '@/types/constants';
import { useWizard } from '@/contexts/WizardContext';
import Button from '@/components/shared/Button';
import Card, { CardContent, CardDescription, CardTitle } from '@/components/shared/Card';
import Alert from '@/components/shared/Alert';
import { Star, ArrowLeft } from 'lucide-react';

const Step2Priorities: React.FC<StepProps> = ({ onNext, onPrevious }) => {
  const { state, actions } = useWizard();
  
  const handlePriorityToggle = (priority: Priority) => {
    const currentPriorities = state.priorities;
    const isSelected = currentPriorities.includes(priority);
    
    if (isSelected) {
      // Remove if already selected
      actions.setPriorities(currentPriorities.filter(p => p !== priority));
    } else {
      // Add if not at maximum
      if (currentPriorities.length < VALIDATION_RULES.PRIORITIES.MAX) {
        actions.setPriorities([...currentPriorities, priority]);
      }
    }
  };

  const validation = actions.validateCurrentStep();
  const selectedCount = state.priorities.length;
  const minCount = VALIDATION_RULES.PRIORITIES.MIN;
  const maxCount = VALIDATION_RULES.PRIORITIES.MAX;
  const remainingSelections = maxCount - selectedCount;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Set Your Priorities
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Choose {minCount}-{maxCount} key priorities for your chat session management system.
        </p>
        
        {/* Selection Counter */}
        <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
          <span className="text-sm font-medium text-gray-700">
            Selected: {selectedCount}/{maxCount}
          </span>
          {selectedCount >= minCount && (
            <Star className="w-4 h-4 ml-2 text-yellow-500 fill-current" />
          )}
        </div>
      </div>

      {/* Priority Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PRIORITY_OPTIONS.map((option) => {
          const isSelected = state.priorities.includes(option.value);
          const canSelect = !isSelected && selectedCount < maxCount;
          const disabled = !isSelected && !canSelect;
          
          return (
            <Card
              key={option.value}
              selected={isSelected}
              onClick={() => handlePriorityToggle(option.value)}
              hover={!disabled}
              disabled={disabled}
              className="h-full relative"
            >
              <CardContent>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl flex-shrink-0" role="img" aria-label={option.label}>
                    {option.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <CardTitle level={4} className="text-base">
                        {option.label}
                      </CardTitle>
                      
                      {/* Badges */}
                      <div className="flex items-center space-x-1">
                        {option.recommended && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Recommended
                          </span>
                        )}
                        
                        {isSelected && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            ✓ Selected
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <CardDescription className="mt-2">
                      {option.description}
                    </CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Helpful Tips */}
      <Alert type="info" title="💡 Selection Tips">
        <div className="space-y-2 text-sm">
          <p>
            <strong>Recommended priorities</strong> are marked with a star and are commonly needed for most chat systems.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <span className="font-medium">For beginners:</span>
              <span className="ml-1">Focus on Message Persistence and Session Management</span>
            </div>
            <div>
              <span className="font-medium">For enterprises:</span>
              <span className="ml-1">Consider User Authentication and Scalability</span>
            </div>
          </div>
        </div>
      </Alert>

      {/* Selection Progress */}
      {selectedCount > 0 && selectedCount < minCount && (
        <Alert type="warning">
          Please select at least {minCount - selectedCount} more priorit{minCount - selectedCount === 1 ? 'y' : 'ies'} to continue.
        </Alert>
      )}

      {selectedCount === maxCount && (
        <Alert type="success">
          Great! You've selected the maximum number of priorities. You can still change your selection if needed.
        </Alert>
      )}

      {/* Validation Errors */}
      {!validation.isValid && (
        <Alert type="error" title="Please complete this step:">
          <ul className="space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-center">
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
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step2Priorities;