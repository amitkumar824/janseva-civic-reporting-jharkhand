#!/bin/bash

# Jan Seva Civic Reporting System - Deployment Script
# This script helps you deploy the entire system

set -e

echo "🏛️  Jan Seva Civic Reporting System - Deployment Script"
echo "========================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if required ports are available
check_ports() {
    local ports=("5000" "5173" "5432")
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_warning "Port $port is already in use. Please free up this port."
        else
            print_success "Port $port is available"
        fi
    done
}

# Setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        cp backend/env.example .env
        print_warning "Created .env file. Please edit it with your configuration."
        print_status "Required variables:"
        echo "  - CLOUDINARY_CLOUD_NAME"
        echo "  - CLOUDINARY_API_KEY" 
        echo "  - CLOUDINARY_API_SECRET"
        echo "  - HUGGINGFACE_API_KEY (optional)"
    else
        print_success ".env file already exists"
    fi
}

# Build and start services
deploy_services() {
    print_status "Building and starting services..."
    
    # Stop existing services
    docker-compose down --remove-orphans
    
    # Build and start
    docker-compose up --build -d
    
    print_success "Services started successfully!"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for PostgreSQL
    print_status "Waiting for PostgreSQL..."
    until docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
        sleep 2
    done
    print_success "PostgreSQL is ready"
    
    # Wait for Backend
    print_status "Waiting for Backend API..."
    until curl -f http://localhost:5000/health > /dev/null 2>&1; do
        sleep 5
    done
    print_success "Backend API is ready"
    
    # Wait for Frontend
    print_status "Waiting for Frontend..."
    until curl -f http://localhost:5173 > /dev/null 2>&1; do
        sleep 5
    done
    print_success "Frontend is ready"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Run database migrations
    docker-compose exec backend npm run db:generate
    docker-compose exec backend npm run db:migrate
    
    print_success "Database setup completed"
}

# Show service status
show_status() {
    print_status "Service Status:"
    docker-compose ps
    
    echo ""
    print_status "Access URLs:"
    echo "  Frontend: http://localhost:5173"
    echo "  Backend API: http://localhost:5000"
    echo "  Health Check: http://localhost:5000/health"
    echo "  Database: localhost:5432"
}

# Show logs
show_logs() {
    print_status "Showing logs (Press Ctrl+C to exit)..."
    docker-compose logs -f
}

# Stop services
stop_services() {
    print_status "Stopping services..."
    docker-compose down
    print_success "Services stopped"
}

# Clean up
cleanup() {
    print_status "Cleaning up..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup completed"
}

# Main menu
show_menu() {
    echo ""
    echo "Choose an option:"
    echo "1) Deploy all services"
    echo "2) Show service status"
    echo "3) Show logs"
    echo "4) Stop services"
    echo "5) Cleanup everything"
    echo "6) Exit"
    echo ""
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            check_docker
            check_ports
            setup_env
            deploy_services
            wait_for_services
            setup_database
            show_status
            ;;
        2)
            show_status
            ;;
        3)
            show_logs
            ;;
        4)
            stop_services
            ;;
        5)
            cleanup
            ;;
        6)
            print_success "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            ;;
    esac
}

# Check if script is run with arguments
if [ $# -eq 0 ]; then
    # Interactive mode
    while true; do
        show_menu
    done
else
    # Command line mode
    case $1 in
        "deploy")
            check_docker
            check_ports
            setup_env
            deploy_services
            wait_for_services
            setup_database
            show_status
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs
            ;;
        "stop")
            stop_services
            ;;
        "cleanup")
            cleanup
            ;;
        "help")
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  deploy   - Deploy all services"
            echo "  status   - Show service status"
            echo "  logs     - Show service logs"
            echo "  stop     - Stop all services"
            echo "  cleanup  - Clean up everything"
            echo "  help     - Show this help message"
            echo ""
            echo "If no command is provided, interactive mode will be started."
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Use '$0 help' for usage information."
            exit 1
            ;;
    esac
fi
