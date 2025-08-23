import React from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserProfile } from '@/components/layout/UserProfile';
import Stepper from '@/components/shared/Stepper';
import { TOTAL_STEPS } from '@/types/constants';

// Import all step components
import Step1Platform from '@/components/steps/Step1Platform';
import Step2Priorities from '@/components/steps/Step2Priorities';
import Step3Features from '@/components/steps/Step3Features';
import Step4Configuration from '@/components/steps/Step4Configuration';
import Step5Review from '@/components/steps/Step5Review';
import Step6Generate from '@/components/steps/Step6Generate';
import Step7AutoSetup from '@/components/steps/Step7AutoSetup';
import Step8Complete from '@/components/steps/Step8Complete';

const ChatManagerBuilder: React.FC = () => {
  const { state, actions } = useWizard();

  const handleNext = () => {
    const validation = actions.validateCurrentStep();
    if (validation.isValid) {
      actions.nextStep();
    }
  };

  const handlePrevious = () => {
    actions.previousStep();
  };

  const handleSkip = () => {
    // Only certain steps can be skipped
    if (state.currentStep === 3 || state.currentStep === 7) {
      actions.nextStep();
    }
  };

  const handleStepClick = (step: number) => {
    if (actions.canGoToStep(step)) {
      actions.goToStep(step);
    }
  };

  const renderCurrentStep = () => {
    const commonProps = {
      onNext: handleNext,
      onPrevious: handlePrevious,
      onSkip: handleSkip,
      isLoading: state.isLoading,
      canSkip: state.currentStep === 3 || state.currentStep === 7,
    };

    switch (state.currentStep) {
      case 1:
        return <Step1Platform {...commonProps} />;
      case 2:
        return <Step2Priorities {...commonProps} />;
      case 3:
        return <Step3Features {...commonProps} />;
      case 4:
        return <Step4Configuration {...commonProps} />;
      case 5:
        return <Step5Review {...commonProps} />;
      case 6:
        return <Step6Generate {...commonProps} />;
      case 7:
        return <Step7AutoSetup {...commonProps} />;
      case 8:
        return <Step8Complete {...commonProps} />;
      default:
        return <Step1Platform {...commonProps} />;
    }
  };

  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with User Profile */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Chat Session Management Builder
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Generate a complete, production-ready chat session management system 
              tailored to your platform and requirements.
            </p>
          </div>
          <div className="ml-8">
            <UserProfile />
          </div>
        </div>

        {/* Welcome message for authenticated user */}
        {user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Welcome back, <span className="font-medium">{user.name}</span>! Your session configurations are automatically saved and synced with your GitHub account.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Navigation */}
        <div className="mb-8">
          <Stepper
            currentStep={state.currentStep}
            totalSteps={TOTAL_STEPS}
            completedSteps={state.completedSteps}
            onStepClick={handleStepClick}
            disabled={state.isLoading}
          />
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {state.error}
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => actions.setError(null)}
                      className="text-sm font-medium text-red-800 hover:text-red-600"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderCurrentStep()}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Built with modern web technologies • Supports 7+ platforms • 
            Production-ready code generation
          </p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-gray-700">Documentation</a>
            <a href="#" className="hover:text-gray-700">Examples</a>
            <a href="#" className="hover:text-gray-700">GitHub</a>
            <a href="#" className="hover:text-gray-700">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatManagerBuilder;