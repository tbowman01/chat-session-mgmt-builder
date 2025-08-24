import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'

// Mock the child components to avoid complex dependency issues
vi.mock('@/components/ChatManagerBuilder', () => ({
  default: () => <div data-testid="chat-manager-builder">Chat Manager Builder</div>
}))

vi.mock('@/components/auth/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  )
}))

vi.mock('@/components/auth/PrivateRoute', () => ({
  PrivateRoute: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="private-route">{children}</div>
  )
}))

vi.mock('@/contexts/WizardContext', () => ({
  WizardProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wizard-provider">{children}</div>
  )
}))

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument()
  })

  it('renders the main app structure with providers and components', () => {
    render(<App />)
    
    // Check that all providers are rendered
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument()
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('wizard-provider')).toBeInTheDocument()
    
    // Check that the main component is rendered
    expect(screen.getByTestId('chat-manager-builder')).toBeInTheDocument()
  })

  it('has the correct CSS class on the main div', () => {
    render(<App />)
    const appDiv = screen.getByText('Chat Manager Builder').closest('.App')
    expect(appDiv).toBeInTheDocument()
    expect(appDiv).toHaveClass('App')
  })

  it('renders providers in the correct hierarchy', () => {
    const { container } = render(<App />)
    
    // Check the hierarchy: AuthProvider > PrivateRoute > WizardProvider > div.App
    const authProvider = container.querySelector('[data-testid="auth-provider"]')
    const privateRoute = authProvider?.querySelector('[data-testid="private-route"]')
    const wizardProvider = privateRoute?.querySelector('[data-testid="wizard-provider"]')
    const appDiv = wizardProvider?.querySelector('.App')
    
    expect(authProvider).toBeInTheDocument()
    expect(privateRoute).toBeInTheDocument()
    expect(wizardProvider).toBeInTheDocument()
    expect(appDiv).toBeInTheDocument()
  })
})