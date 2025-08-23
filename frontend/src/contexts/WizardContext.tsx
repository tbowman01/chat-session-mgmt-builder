import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { WizardState, BuildConfiguration, GeneratedSolution, AppError } from '@/types';
import { STORAGE_KEYS, TOTAL_STEPS } from '@/types/constants';

// Initial state
const initialConfiguration: BuildConfiguration = {
  platform: null,
  priorities: [],
  features: [],
  teamSize: null,
  complexity: null,
  projectName: '',
  description: ''
};

const initialState: WizardState = {
  ...initialConfiguration,
  currentStep: 1,
  completedSteps: [],
  isLoading: false,
  error: null,
  generatedSolution: null
};

// Action types
type WizardAction =
  | { type: 'SET_PLATFORM'; payload: WizardState['platform'] }
  | { type: 'SET_PRIORITIES'; payload: WizardState['priorities'] }
  | { type: 'SET_FEATURES'; payload: WizardState['features'] }
  | { type: 'SET_TEAM_SIZE'; payload: WizardState['teamSize'] }
  | { type: 'SET_COMPLEXITY'; payload: WizardState['complexity'] }
  | { type: 'SET_PROJECT_NAME'; payload: string }
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'ADD_COMPLETED_STEP'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_GENERATED_SOLUTION'; payload: GeneratedSolution | null }
  | { type: 'RESET_WIZARD' }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<WizardState> };

// Reducer function
function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_PLATFORM':
      return { ...state, platform: action.payload };
    
    case 'SET_PRIORITIES':
      return { ...state, priorities: action.payload };
    
    case 'SET_FEATURES':
      return { ...state, features: action.payload };
    
    case 'SET_TEAM_SIZE':
      return { ...state, teamSize: action.payload };
    
    case 'SET_COMPLEXITY':
      return { ...state, complexity: action.payload };
    
    case 'SET_PROJECT_NAME':
      return { ...state, projectName: action.payload };
    
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'ADD_COMPLETED_STEP':
      if (!state.completedSteps.includes(action.payload)) {
        return {
          ...state,
          completedSteps: [...state.completedSteps, action.payload].sort()
        };
      }
      return state;
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_GENERATED_SOLUTION':
      return { ...state, generatedSolution: action.payload };
    
    case 'RESET_WIZARD':
      return initialState;
    
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

// Context interface
interface WizardContextType {
  state: WizardState;
  actions: {
    setPlatform: (platform: WizardState['platform']) => void;
    setPriorities: (priorities: WizardState['priorities']) => void;
    setFeatures: (features: WizardState['features']) => void;
    setTeamSize: (teamSize: WizardState['teamSize']) => void;
    setComplexity: (complexity: WizardState['complexity']) => void;
    setProjectName: (name: string) => void;
    setDescription: (description: string) => void;
    setCurrentStep: (step: number) => void;
    addCompletedStep: (step: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setGeneratedSolution: (solution: GeneratedSolution | null) => void;
    resetWizard: () => void;
    nextStep: () => void;
    previousStep: () => void;
    goToStep: (step: number) => void;
    canGoToStep: (step: number) => boolean;
    validateCurrentStep: () => { isValid: boolean; errors: string[] };
    saveToStorage: () => void;
    loadFromStorage: () => void;
  };
}

// Create context
const WizardContext = createContext<WizardContextType | undefined>(undefined);

// Provider component
interface WizardProviderProps {
  children: ReactNode;
}

export function WizardProvider({ children }: WizardProviderProps) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  // Actions
  const actions = {
    setPlatform: (platform: WizardState['platform']) => 
      dispatch({ type: 'SET_PLATFORM', payload: platform }),
    
    setPriorities: (priorities: WizardState['priorities']) =>
      dispatch({ type: 'SET_PRIORITIES', payload: priorities }),
    
    setFeatures: (features: WizardState['features']) =>
      dispatch({ type: 'SET_FEATURES', payload: features }),
    
    setTeamSize: (teamSize: WizardState['teamSize']) =>
      dispatch({ type: 'SET_TEAM_SIZE', payload: teamSize }),
    
    setComplexity: (complexity: WizardState['complexity']) =>
      dispatch({ type: 'SET_COMPLEXITY', payload: complexity }),
    
    setProjectName: (name: string) =>
      dispatch({ type: 'SET_PROJECT_NAME', payload: name }),
    
    setDescription: (description: string) =>
      dispatch({ type: 'SET_DESCRIPTION', payload: description }),
    
    setCurrentStep: (step: number) =>
      dispatch({ type: 'SET_CURRENT_STEP', payload: step }),
    
    addCompletedStep: (step: number) =>
      dispatch({ type: 'ADD_COMPLETED_STEP', payload: step }),
    
    setLoading: (loading: boolean) =>
      dispatch({ type: 'SET_LOADING', payload: loading }),
    
    setError: (error: string | null) =>
      dispatch({ type: 'SET_ERROR', payload: error }),
    
    setGeneratedSolution: (solution: GeneratedSolution | null) =>
      dispatch({ type: 'SET_GENERATED_SOLUTION', payload: solution }),
    
    resetWizard: () => {
      dispatch({ type: 'RESET_WIZARD' });
      localStorage.removeItem(STORAGE_KEYS.WIZARD_STATE);
    },
    
    nextStep: () => {
      if (state.currentStep < TOTAL_STEPS) {
        const nextStep = state.currentStep + 1;
        dispatch({ type: 'ADD_COMPLETED_STEP', payload: state.currentStep });
        dispatch({ type: 'SET_CURRENT_STEP', payload: nextStep });
      }
    },
    
    previousStep: () => {
      if (state.currentStep > 1) {
        dispatch({ type: 'SET_CURRENT_STEP', payload: state.currentStep - 1 });
      }
    },
    
    goToStep: (step: number) => {
      if (step >= 1 && step <= TOTAL_STEPS) {
        dispatch({ type: 'SET_CURRENT_STEP', payload: step });
      }
    },
    
    canGoToStep: (step: number): boolean => {
      // Can always go to the first step
      if (step === 1) return true;
      
      // Can go to a step if the previous step is completed
      return state.completedSteps.includes(step - 1) || step <= state.currentStep;
    },
    
    validateCurrentStep: (): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];
      
      switch (state.currentStep) {
        case 1: // Platform selection
          if (!state.platform) {
            errors.push('Please select a platform');
          }
          break;
          
        case 2: // Priority selection
          if (state.priorities.length < 2) {
            errors.push('Please select at least 2 priorities');
          }
          if (state.priorities.length > 4) {
            errors.push('Please select no more than 4 priorities');
          }
          break;
          
        case 3: // Feature selection (optional, so no validation needed)
          break;
          
        case 4: // Team and complexity
          if (!state.teamSize) {
            errors.push('Please select team size');
          }
          if (!state.complexity) {
            errors.push('Please select complexity level');
          }
          if (!state.projectName.trim()) {
            errors.push('Please enter a project name');
          }
          if (state.projectName.length < 3) {
            errors.push('Project name must be at least 3 characters');
          }
          if (!state.description.trim()) {
            errors.push('Please enter a project description');
          }
          if (state.description.length < 10) {
            errors.push('Project description must be at least 10 characters');
          }
          break;
          
        case 5: // Review (always valid)
          break;
          
        default:
          break;
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    },
    
    saveToStorage: () => {
      try {
        const dataToSave = {
          ...state,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.WIZARD_STATE, JSON.stringify(dataToSave));
      } catch (error) {
        console.warn('Failed to save wizard state to localStorage:', error);
      }
    },
    
    loadFromStorage: () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.WIZARD_STATE);
        if (stored) {
          const parsedData = JSON.parse(stored);
          // Remove timestamp before loading
          const { timestamp, ...stateData } = parsedData;
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: stateData });
        }
      } catch (error) {
        console.warn('Failed to load wizard state from localStorage:', error);
      }
    }
  };

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    actions.saveToStorage();
  }, [state]);

  // Load from localStorage on mount
  useEffect(() => {
    actions.loadFromStorage();
  }, []);

  return (
    <WizardContext.Provider value={{ state, actions }}>
      {children}
    </WizardContext.Provider>
  );
}

// Hook to use the wizard context
export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}

export default WizardContext;