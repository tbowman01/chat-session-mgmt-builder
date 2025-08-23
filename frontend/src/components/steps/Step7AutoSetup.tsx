import React, { useState } from 'react';
import { StepProps } from '@/types';
import { useWizard } from '@/contexts/WizardContext';
import Button from '@/components/shared/Button';
import Card, { CardContent, CardDescription, CardTitle, CardHeader } from '@/components/shared/Card';
import Alert from '@/components/shared/Alert';
import { ArrowLeft, Terminal, Download, ExternalLink, CheckCircle, AlertCircle, Play, Pause } from 'lucide-react';

const Step7AutoSetup: React.FC<StepProps> = ({ onNext, onPrevious, canSkip }) => {
  const { state } = useWizard();
  const [setupStep, setSetupStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [setupComplete, setSetupComplete] = useState(false);

  const solution = state.generatedSolution;
  if (!solution) return null;

  const setupSteps = [
    { name: 'Project Directory', command: `mkdir ${state.projectName}`, description: 'Create project directory' },
    { name: 'Extract Files', command: 'Extracting generated files...', description: 'Extract all generated files' },
    { name: 'Install Dependencies', command: 'npm install', description: 'Install required packages' },
    { name: 'Environment Setup', command: 'cp .env.example .env', description: 'Create environment file' },
    { name: 'Initialize Database', command: 'npm run init-db', description: 'Set up database (if required)' },
    { name: 'Build Project', command: 'npm run build', description: 'Build the application' },
    { name: 'Verify Setup', command: 'npm test', description: 'Run initial tests' },
  ];

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev, logEntry]);
  };

  const simulateSetupStep = async (step: number): Promise<boolean> => {
    const currentStep = setupSteps[step];
    addLog(`Starting: ${currentStep.name}`, 'info');
    addLog(`Running: ${currentStep.command}`, 'info');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // Simulate success/failure (mostly successful)
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      addLog(`✓ Completed: ${currentStep.name}`, 'success');
      return true;
    } else {
      addLog(`✗ Failed: ${currentStep.name}`, 'error');
      return false;
    }
  };

  const handleStartAutoSetup = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setLogs([]);
    addLog('Starting automated setup...', 'info');
    
    try {
      for (let i = 0; i < setupSteps.length; i++) {
        setSetupStep(i);
        const success = await simulateSetupStep(i);
        
        if (!success) {
          addLog('Setup failed. Please check the logs and try manual setup.', 'error');
          setIsRunning(false);
          return;
        }
      }
      
      addLog('🎉 Automated setup completed successfully!', 'success');
      setSetupComplete(true);
      
    } catch (error) {
      addLog(`Setup error: ${error}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleManualSetup = () => {
    // Create a downloadable setup script
    const setupScript = solution.setupInstructions
      .map((instruction, index) => `# Step ${index + 1}: ${instruction}`)
      .join('\n');

    const blob = new Blob([`#!/bin/bash\n\n# Automated Setup Script for ${state.projectName}\n\n${setupScript}\n`], {
      type: 'text/plain'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'setup.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Automated Setup
        </h2>
        <p className="text-lg text-gray-600">
          Let us set up your {solution.platform} project automatically, or download setup instructions for manual installation.
        </p>
      </div>

      {/* Setup Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="relative">
          <CardHeader>
            <CardTitle level={3} className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-primary-600" />
              <span>Automated Setup</span>
            </CardTitle>
            <CardDescription>
              Run the complete setup process automatically in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-2">This will:</p>
                <ul className="space-y-1">
                  <li>• Create project directory structure</li>
                  <li>• Install all dependencies</li>
                  <li>• Configure environment files</li>
                  <li>• Run initial setup commands</li>
                </ul>
              </div>
              
              <Alert type="info">
                <p className="text-sm">
                  Note: This is a simulation. In a real implementation, this would execute actual setup commands.
                </p>
              </Alert>
              
              <Button
                onClick={handleStartAutoSetup}
                disabled={isRunning}
                variant="primary"
                fullWidth
                icon={isRunning ? <Pause /> : <Play />}
                loading={isRunning}
              >
                {isRunning ? 'Setting Up...' : 'Start Automated Setup'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle level={3} className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-gray-600" />
              <span>Manual Setup</span>
            </CardTitle>
            <CardDescription>
              Download setup instructions and run them manually.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-2">Perfect if you prefer to:</p>
                <ul className="space-y-1">
                  <li>• Follow step-by-step instructions</li>
                  <li>• Customize the setup process</li>
                  <li>• Run setup on your local machine</li>
                  <li>• Have full control over each step</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={handleManualSetup}
                  variant="outline"
                  fullWidth
                  icon={<Download />}
                >
                  Download Setup Script
                </Button>
                
                <Button
                  variant="ghost"
                  fullWidth
                  icon={<ExternalLink />}
                  onClick={() => window.open(`https://docs.${solution.platform}.com`, '_blank')}
                >
                  View Platform Documentation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Progress */}
      {(isRunning || logs.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle level={3}>Setup Progress</CardTitle>
            <CardDescription>
              {isRunning ? 'Setup is running...' : setupComplete ? 'Setup completed!' : 'Setup stopped'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{isRunning ? setupStep + 1 : setupComplete ? setupSteps.length : setupStep + 1} of {setupSteps.length}</span>
              </div>
              
              <div className="space-y-2">
                {setupSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < setupStep ? 'bg-green-500 text-white' :
                      index === setupStep && isRunning ? 'bg-primary-500 text-white animate-pulse' :
                      index === setupStep && setupComplete ? 'bg-green-500 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {index < setupStep || setupComplete ? <CheckCircle className="w-3 h-3" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        index <= setupStep ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.name}
                      </div>
                      <div className={`text-xs ${
                        index <= setupStep ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Console Output */}
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {logs.length === 0 && !isRunning && (
                <div className="text-gray-500">Setup logs will appear here...</div>
              )}
              {logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))}
              {isRunning && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Running...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {setupComplete && (
        <Alert type="success" title="Setup Complete!">
          <div className="space-y-2">
            <p>Your {solution.platform} project has been set up successfully.</p>
            <div className="text-sm">
              <strong>What's ready:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Project directory created</li>
                <li>All dependencies installed</li>
                <li>Environment configured</li>
                <li>Database initialized (if required)</li>
                <li>Build process completed</li>
              </ul>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Next steps:</strong> Navigate to your project directory and run `npm start` to launch your chat system!
              </p>
            </div>
          </div>
        </Alert>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle level={3}>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Common Issues:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Check Node.js version (18+ required)</li>
                <li>• Ensure all environment variables are set</li>
                <li>• Verify database connection</li>
                <li>• Check API keys and tokens</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Resources:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Platform documentation</li>
                <li>• Community forums</li>
                <li>• GitHub examples</li>
                <li>• Video tutorials</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onPrevious}
          variant="outline"
          size="lg"
          icon={<ArrowLeft />}
        >
          Back to Files
        </Button>
        
        <div className="flex space-x-3">
          {canSkip && (
            <Button
              onClick={onNext}
              variant="ghost"
              size="lg"
            >
              Skip Setup
            </Button>
          )}
          
          <Button
            onClick={onNext}
            variant="primary"
            size="lg"
            disabled={isRunning}
          >
            {setupComplete ? 'Continue' : 'Skip to Completion'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step7AutoSetup;