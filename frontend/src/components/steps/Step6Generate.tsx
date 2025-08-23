import React, { useEffect, useState } from 'react';
import { StepProps, GeneratedSolution } from '@/types';
import { useWizard } from '@/contexts/WizardContext';
import { generateSolution } from '@/generators';
import Button from '@/components/shared/Button';
import Card, { CardContent, CardDescription, CardTitle, CardHeader } from '@/components/shared/Card';
import Alert from '@/components/shared/Alert';
import { ArrowLeft, Download, Copy, FileText, Package, Play, CheckCircle, AlertCircle } from 'lucide-react';

const Step6Generate: React.FC<StepProps> = ({ onNext, onPrevious, isLoading }) => {
  const { state, actions } = useWizard();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedFiles, setCopiedFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!state.generatedSolution) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    actions.setLoading(true);

    try {
      const solution = await generateSolution({
        platform: state.platform!,
        priorities: state.priorities,
        features: state.features,
        teamSize: state.teamSize!,
        complexity: state.complexity!,
        projectName: state.projectName,
        description: state.description,
      });

      actions.setGeneratedSolution(solution);
      actions.addCompletedStep(6);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate solution';
      setError(errorMessage);
      actions.setError(errorMessage);
    } finally {
      setGenerating(false);
      actions.setLoading(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!state.generatedSolution) return;

    try {
      // Create a zip file with all generated files
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add all files to zip
      state.generatedSolution.files.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Generate zip and download
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleCopyFile = async (file: any) => {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopiedFiles(prev => new Set(prev).add(file.path));
      
      // Reset copied state after 3 seconds
      setTimeout(() => {
        setCopiedFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(file.path);
          return newSet;
        });
      }, 3000);
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Copy failed. Please try copying manually.');
    }
  };

  const handleCopyAll = async () => {
    if (!state.generatedSolution) return;

    try {
      const allContent = state.generatedSolution.files
        .map(file => `// File: ${file.path}\n${file.content}`)
        .join('\n\n// ' + '='.repeat(50) + '\n\n');
      
      await navigator.clipboard.writeText(allContent);
      alert('All files copied to clipboard!');
    } catch (error) {
      console.error('Copy all failed:', error);
      alert('Copy failed. Files might be too large for clipboard.');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'config': return <Package className="w-4 h-4" />;
      case 'source': return <FileText className="w-4 h-4" />;
      case 'documentation': return <FileText className="w-4 h-4" />;
      case 'script': return <Play className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'config': return 'text-blue-600';
      case 'source': return 'text-green-600';
      case 'documentation': return 'text-purple-600';
      case 'script': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  if (generating || isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Generating Your Solution
          </h2>
          <p className="text-lg text-gray-600">
            Please wait while we create your custom chat session management system...
          </p>
        </div>

        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>

        <div className="text-center text-gray-500">
          <p>This may take a few moments...</p>
          <p className="text-sm mt-2">Generating {state.platform} solution with {state.priorities.length} priorities and {state.features.length} features</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Generation Failed
          </h2>
        </div>

        <Alert type="error" title="Generation Error">
          <p>{error}</p>
          <div className="mt-4">
            <Button onClick={handleGenerate} variant="primary">
              Try Again
            </Button>
          </div>
        </Alert>

        <div className="flex justify-between pt-6">
          <Button onClick={onPrevious} variant="outline" size="lg" icon={<ArrowLeft />}>
            Back to Review
          </Button>
          <div />
        </div>
      </div>
    );
  }

  const solution = state.generatedSolution;
  if (!solution) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your Solution is Ready!
        </h2>
        <p className="text-lg text-gray-600">
          We've generated a complete {solution.platform} chat session management system for you.
        </p>
      </div>

      {/* Solution Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {solution.files.length}
            </div>
            <div className="text-sm text-gray-600">Generated Files</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {solution.estimatedTime}
            </div>
            <div className="text-sm text-gray-600">Estimated Setup Time</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2 capitalize">
              {solution.complexity}
            </div>
            <div className="text-sm text-gray-600">Complexity Level</div>
          </CardContent>
        </Card>
      </div>

      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle level={3}>Download Your Solution</CardTitle>
          <CardDescription>
            Get your complete project files and start building immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handleDownloadZip}
              variant="primary"
              size="lg"
              icon={<Download />}
            >
              Download ZIP File
            </Button>
            
            <Button
              onClick={handleCopyAll}
              variant="outline"
              size="lg"
              icon={<Copy />}
            >
              Copy All Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      <Card>
        <CardHeader>
          <CardTitle level={3}>Generated Files ({solution.files.length})</CardTitle>
          <CardDescription>
            Preview and copy individual files as needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {solution.files.map((file, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={getFileTypeColor(file.type)}>
                      {getFileIcon(file.type)}
                    </div>
                    <div>
                      <div className="font-mono text-sm font-medium">{file.path}</div>
                      <div className="text-xs text-gray-500">{file.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      file.type === 'config' ? 'bg-blue-100 text-blue-800' :
                      file.type === 'source' ? 'bg-green-100 text-green-800' :
                      file.type === 'documentation' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {file.type}
                    </span>
                    
                    <Button
                      onClick={() => handleCopyFile(file)}
                      variant="ghost"
                      size="sm"
                      icon={copiedFiles.has(file.path) ? <CheckCircle /> : <Copy />}
                    >
                      {copiedFiles.has(file.path) ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto max-h-64">
                    <code>{file.content}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle level={3}>Setup Instructions</CardTitle>
          <CardDescription>
            Follow these steps to get your chat system up and running.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {solution.setupInstructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700">{instruction}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Success Alert */}
      <Alert type="success" title="Solution Generated Successfully!">
        <div className="space-y-2">
          <p>Your {solution.platform} chat session management system is ready to use.</p>
          <div className="text-sm">
            <strong>What's included:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Complete source code with your selected features</li>
              <li>Configuration files and environment setup</li>
              <li>Documentation and README</li>
              <li>Package.json with all dependencies</li>
              <li>Docker configuration for easy deployment</li>
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
          Back to Review
        </Button>
        
        <div className="flex space-x-3">
          <Button
            onClick={onNext}
            variant="primary"
            size="lg"
          >
            Continue to Setup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step6Generate;