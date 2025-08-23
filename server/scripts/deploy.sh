#!/bin/bash

# Chat Session Management Builder - Deployment Script
# This script handles various deployment scenarios

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="chat-session-mgmt-builder"
API_IMAGE="$PROJECT_NAME-api"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-}"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        warn ".env file not found. Using .env.example as template."
        if [ -f .env.example ]; then
            cp .env.example .env
            warn "Please update the .env file with your actual API tokens before proceeding."
            read -p "Press enter to continue once you've updated the .env file..."
        else
            error ".env.example file not found."
        fi
    fi
    
    # Validate required environment variables
    if [ -f .env ]; then
        source .env
        if [ -z "$NOTION_TOKEN" ] || [ -z "$AIRTABLE_TOKEN" ]; then
            error "NOTION_TOKEN and AIRTABLE_TOKEN must be set in .env file"
        fi
        
        if [[ ! "$NOTION_TOKEN" =~ ^secret_ ]]; then
            error "NOTION_TOKEN must start with 'secret_'"
        fi
        
        if [[ ! "$AIRTABLE_TOKEN" =~ ^pat ]]; then
            error "AIRTABLE_TOKEN must start with 'pat'"
        fi
    fi
    
    log "Prerequisites check passed ✅"
}

# Build Docker image
build_image() {
    log "Building Docker image..."
    
    docker build -t $API_IMAGE:latest .
    
    if [ $? -eq 0 ]; then
        log "Docker image built successfully ✅"
    else
        error "Docker image build failed"
    fi
}

# Run tests
run_tests() {
    log "Running tests..."
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        npm ci
    fi
    
    # Run TypeScript check
    npm run typecheck
    
    # Run linting
    npm run lint
    
    # Run tests
    npm test
    
    if [ $? -eq 0 ]; then
        log "All tests passed ✅"
    else
        error "Tests failed"
    fi
}

# Deploy to development
deploy_development() {
    log "Deploying to development environment..."
    
    # Stop any existing containers
    docker-compose down
    
    # Build and start services
    docker-compose up --build -d
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 10
    
    # Health check
    if curl -f http://localhost:8787/health &> /dev/null; then
        log "Development deployment successful ✅"
        info "API available at: http://localhost:8787"
        info "Health check: http://localhost:8787/health"
        info "API docs: http://localhost:8787/api"
    else
        error "Health check failed. Deployment may have issues."
    fi
}

# Deploy to production
deploy_production() {
    log "Deploying to production environment..."
    
    # Build production image
    build_image
    
    # Tag image with version
    VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
    docker tag $API_IMAGE:latest $API_IMAGE:$VERSION
    
    # Push to registry if configured
    if [ -n "$DOCKER_REGISTRY" ]; then
        log "Pushing image to registry..."
        docker tag $API_IMAGE:latest $DOCKER_REGISTRY/$API_IMAGE:latest
        docker tag $API_IMAGE:latest $DOCKER_REGISTRY/$API_IMAGE:$VERSION
        docker push $DOCKER_REGISTRY/$API_IMAGE:latest
        docker push $DOCKER_REGISTRY/$API_IMAGE:$VERSION
    fi
    
    # Deploy with production profile
    docker-compose --profile production up -d
    
    log "Production deployment completed ✅"
}

# Deploy to Kubernetes
deploy_kubernetes() {
    log "Deploying to Kubernetes..."
    
    if ! command -v kubectl &> /dev/null; then
        error "kubectl is not installed"
    fi
    
    # Apply Kubernetes manifests
    if [ -d "k8s" ]; then
        kubectl apply -f k8s/
        log "Kubernetes deployment applied ✅"
    else
        warn "No k8s directory found. Skipping Kubernetes deployment."
    fi
}

# Show logs
show_logs() {
    log "Showing application logs..."
    docker-compose logs -f api
}

# Clean up
cleanup() {
    log "Cleaning up..."
    
    # Stop and remove containers
    docker-compose down -v
    
    # Remove images
    docker rmi $API_IMAGE:latest 2>/dev/null || true
    
    # Prune unused images
    docker image prune -f
    
    log "Cleanup completed ✅"
}

# Backup data
backup() {
    log "Creating backup..."
    
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p $BACKUP_DIR
    
    # Backup logs
    if [ -d "logs" ]; then
        cp -r logs $BACKUP_DIR/
    fi
    
    # Backup configuration
    cp .env $BACKUP_DIR/env.backup 2>/dev/null || true
    cp docker-compose.yml $BACKUP_DIR/
    
    log "Backup created at $BACKUP_DIR ✅"
}

# Show help
show_help() {
    echo "Chat Session Management Builder - Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  check         Check prerequisites"
    echo "  build         Build Docker image"
    echo "  test          Run tests"
    echo "  dev           Deploy to development (default)"
    echo "  prod          Deploy to production"
    echo "  k8s           Deploy to Kubernetes"
    echo "  logs          Show application logs"
    echo "  backup        Create backup"
    echo "  clean         Clean up containers and images"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev        # Deploy to development"
    echo "  $0 prod       # Deploy to production"
    echo "  $0 test       # Run tests"
    echo "  $0 logs       # Show logs"
    echo ""
}

# Main execution
main() {
    case "${1:-dev}" in
        "check")
            check_prerequisites
            ;;
        "build")
            check_prerequisites
            build_image
            ;;
        "test")
            check_prerequisites
            run_tests
            ;;
        "dev")
            check_prerequisites
            deploy_development
            ;;
        "prod")
            check_prerequisites
            run_tests
            deploy_production
            ;;
        "k8s")
            check_prerequisites
            deploy_kubernetes
            ;;
        "logs")
            show_logs
            ;;
        "backup")
            backup
            ;;
        "clean")
            cleanup
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            error "Unknown command: $1. Use '$0 help' for usage information."
            ;;
    esac
}

# Run main function
main "$@"