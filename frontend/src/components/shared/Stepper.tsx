import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { StepperProps } from '@/types';
import { STEPS } from '@/types/constants';
import { clsx } from 'clsx';

const Stepper: React.FC<StepperProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
  onStepClick,
  disabled = false
}) => {
  const getStepStatus = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) return 'completed';
    if (stepNumber === currentStep) return 'current';
    if (stepNumber < currentStep) return 'completed';
    return 'upcoming';
  };

  const canClickStep = (stepNumber: number) => {
    if (disabled) return false;
    // Allow clicking on current step, completed steps, or the next step
    return stepNumber <= currentStep || completedSteps.includes(stepNumber - 1);
  };

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-center space-x-2 sm:space-x-4">
        {STEPS.slice(0, totalSteps).map((step, index) => {
          const stepNumber = step.id;
          const status = getStepStatus(stepNumber);
          const isClickable = canClickStep(stepNumber);
          
          return (
            <li key={step.id} className="flex items-center">
              {/* Step Circle */}
              <button
                type="button"
                onClick={() => isClickable ? onStepClick(stepNumber) : undefined}
                disabled={!isClickable}
                className={clsx(
                  'relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-200',
                  {
                    // Completed step
                    'bg-primary-600 text-white hover:bg-primary-700': 
                      status === 'completed' && isClickable,
                    'bg-primary-600 text-white': 
                      status === 'completed' && !isClickable,
                    
                    // Current step
                    'bg-primary-600 text-white ring-4 ring-primary-200': 
                      status === 'current',
                    
                    // Upcoming step
                    'bg-gray-200 text-gray-500 hover:bg-gray-300': 
                      status === 'upcoming' && isClickable,
                    'bg-gray-200 text-gray-500': 
                      status === 'upcoming' && !isClickable,
                  },
                  {
                    'cursor-pointer': isClickable && !disabled,
                    'cursor-not-allowed opacity-50': disabled,
                    'cursor-default': !isClickable && !disabled,
                  }
                )}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {status === 'completed' ? (
                  <Check className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <span className="text-xs">{stepNumber}</span>
                )}
                
                {/* Screen reader text */}
                <span className="sr-only">
                  {status === 'completed' 
                    ? `Step ${stepNumber} ${step.title}, completed`
                    : status === 'current' 
                    ? `Step ${stepNumber} ${step.title}, current step`
                    : `Step ${stepNumber} ${step.title}`
                  }
                </span>
              </button>
              
              {/* Step Label - Hidden on mobile */}
              <div className="hidden sm:block ml-3">
                <div
                  className={clsx(
                    'text-sm font-medium transition-colors duration-200',
                    {
                      'text-primary-600': status === 'current' || status === 'completed',
                      'text-gray-500': status === 'upcoming',
                    }
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-400">
                  {step.description}
                </div>
              </div>
              
              {/* Connector Arrow */}
              {index < STEPS.slice(0, totalSteps).length - 1 && (
                <ChevronRight 
                  className={clsx(
                    'w-5 h-5 mx-2 sm:mx-4 transition-colors duration-200',
                    {
                      'text-primary-600': stepNumber < currentStep || completedSteps.includes(stepNumber),
                      'text-gray-300': stepNumber >= currentStep && !completedSteps.includes(stepNumber),
                    }
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      
      {/* Mobile Step Info */}
      <div className="sm:hidden mt-4 text-center">
        <div className="text-sm font-medium text-primary-600">
          Step {currentStep}: {STEPS[currentStep - 1]?.title}
        </div>
        <div className="text-xs text-gray-500">
          {STEPS[currentStep - 1]?.description}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${((completedSteps.length + (currentStep > completedSteps.length ? 0.5 : 0)) / totalSteps) * 100}%`
          }}
        />
      </div>
      
      {/* Progress Text */}
      <div className="mt-2 text-center text-sm text-gray-500">
        Step {currentStep} of {totalSteps}
        {completedSteps.length > 0 && (
          <span className="ml-2">
            ({completedSteps.length} completed)
          </span>
        )}
      </div>
    </nav>
  );
};

export default Stepper;