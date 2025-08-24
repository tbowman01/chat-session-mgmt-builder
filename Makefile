# 🚀 Chat Session Management Builder - Developer Journey Makefile
# A motivational build system that encourages growth, learning, and deployment mastery

# Colors and emojis for beautiful output
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
PURPLE := \033[35m
BLUE := \033[34m
BOLD := \033[1m
RESET := \033[0m

# Progress tracking files
PROGRESS_DIR := .dev-journey
SKILLS_FILE := $(PROGRESS_DIR)/skills.json
LOG_FILE := $(PROGRESS_DIR)/journey.log
ACHIEVEMENTS_FILE := $(PROGRESS_DIR)/achievements.txt

# Docker configuration
DOCKER_NETWORK := chat-builder-network
FRONTEND_IMAGE := chat-builder-frontend
BACKEND_IMAGE := chat-builder-backend
FRONTEND_CONTAINER := chat-frontend
BACKEND_CONTAINER := chat-backend

# Development milestones and skill points
BEGINNER_XP := 100
INTERMEDIATE_XP := 500
ADVANCED_XP := 1000
EXPERT_XP := 2000

.PHONY: help welcome journey skills achievements setup-env
.DEFAULT_GOAL := welcome

# 🌟 Welcome message with motivational quote
welcome:
	@echo ""
	@echo "$(CYAN)╔══════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║                                                              ║$(RESET)"
	@echo "$(CYAN)║  $(BOLD)🚀 Welcome to Your Developer Journey! 🚀$(RESET)$(CYAN)                 ║$(RESET)"
	@echo "$(CYAN)║                                                              ║$(RESET)"
	@echo "$(CYAN)║  $(PURPLE)\"The journey of a thousand commits begins with a single make\"$(RESET)$(CYAN)  ║$(RESET)"
	@echo "$(CYAN)║                                                              ║$(RESET)"
	@echo "$(CYAN)╚══════════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(BOLD)$(BLUE)Ready to build something amazing? 🌟$(RESET)"
	@echo ""
	@$(MAKE) help

# 📚 Display help with motivational context
help:
	@echo "$(BOLD)$(GREEN)🎯 Your Development Quest Awaits!$(RESET)"
	@echo ""
	@echo "$(BOLD)📈 Progress & Growth:$(RESET)"
	@echo "  $(CYAN)journey$(RESET)          🌱 Start your development journey and track progress"
	@echo "  $(CYAN)skills$(RESET)           🎓 View your current skill level and achievements"
	@echo "  $(CYAN)achievements$(RESET)     🏆 See all your unlocked achievements"
	@echo ""
	@echo "$(BOLD)🏠 Local Development (Beginner Friendly):$(RESET)"
	@echo "  $(CYAN)setup$(RESET)            🔧 Initialize your development environment"  
	@echo "  $(CYAN)setup-env$(RESET)        🔐 Create .env files with development defaults"
	@echo "  $(CYAN)install$(RESET)          📦 Install dependencies with progress tracking"
	@echo "  $(CYAN)dev$(RESET)              🎮 Start development servers (unlock: Quick Starter)"
	@echo "  $(CYAN)dev-logs$(RESET)         📝 View development logs with real-time updates"
	@echo ""
	@echo "$(BOLD)🐳 Container Mastery (Intermediate):$(RESET)"
	@echo "  $(CYAN)docker-build$(RESET)     🔨 Build Docker images (unlock: Container Architect)"
	@echo "  $(CYAN)docker-up$(RESET)        🚀 Launch full containerized environment"
	@echo "  $(CYAN)docker-down$(RESET)      📥 Stop and clean up containers gracefully"
	@echo "  $(CYAN)docker-logs$(RESET)      🔍 View container logs with filtering options"
	@echo "  $(CYAN)docker-shell$(RESET)     🐚 Enter container shell for debugging"
	@echo ""
	@echo "$(BOLD)🔧 Quality & Testing (Advanced):$(RESET)"
	@echo "  $(CYAN)test$(RESET)             🧪 Run test suite (unlock: Quality Guardian)"
	@echo "  $(CYAN)lint$(RESET)             ✨ Check code quality and style"
	@echo "  $(CYAN)typecheck$(RESET)        🔍 Verify TypeScript types"
	@echo "  $(CYAN)security$(RESET)         🛡️  Security audit and vulnerability scan"
	@echo "  $(CYAN)performance$(RESET)      ⚡ Performance analysis and optimization"
	@echo ""
	@echo "$(BOLD)🚀 Production Ready (Expert):$(RESET)"
	@echo "  $(CYAN)build$(RESET)            📦 Production build (unlock: Build Master)"
	@echo "  $(CYAN)deploy$(RESET)           🌐 Deploy to production environment"
	@echo "  $(CYAN)backup$(RESET)           💾 Backup project and configurations"
	@echo "  $(CYAN)restore$(RESET)          🔄 Restore from backup"
	@echo ""
	@echo "$(BOLD)🎉 Fun & Motivation:$(RESET)"
	@echo "  $(CYAN)celebrate$(RESET)        🎊 Celebrate your achievements!"
	@echo "  $(CYAN)wisdom$(RESET)           💡 Get motivational developer wisdom"
	@echo "  $(CYAN)clean-slate$(RESET)      🆕 Fresh start (reset progress)"
	@echo ""
	@echo "$(YELLOW)💡 Tip: Each command earns you XP and unlocks achievements!$(RESET)"
	@echo "$(YELLOW)💡 Type 'make journey' to start tracking your progress.$(RESET)"
	@echo ""

# 🌱 Initialize developer journey tracking
journey:
	@echo "$(BOLD)$(GREEN)🌱 Initializing Your Developer Journey...$(RESET)"
	@mkdir -p $(PROGRESS_DIR)
	@if [ ! -f $(SKILLS_FILE) ]; then \
		echo '{"level": "Aspiring Developer", "xp": 0, "commands_used": [], "achievements": [], "start_date": "'$$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"}' > $(SKILLS_FILE); \
		echo "$(GREEN)✅ Skills tracking initialized!$(RESET)"; \
	fi
	@if [ ! -f $(LOG_FILE) ]; then \
		echo "$$(date): 🌟 Developer journey started! Welcome to the path of continuous learning." > $(LOG_FILE); \
		echo "$(GREEN)✅ Journey log created!$(RESET)"; \
	fi
	@if [ ! -f $(ACHIEVEMENTS_FILE) ]; then \
		touch $(ACHIEVEMENTS_FILE); \
		echo "$(GREEN)✅ Achievement system ready!$(RESET)"; \
	fi
	@echo ""
	@echo "$(CYAN)🎉 Your developer journey has begun!$(RESET)"
	@echo "$(YELLOW)Every command you run will contribute to your growth.$(RESET)"
	@$(MAKE) skills

# 🎓 Display current skills and progress
skills:
	@echo "$(BOLD)$(PURPLE)🎓 Your Developer Profile$(RESET)"
	@echo ""
	@if [ -f $(SKILLS_FILE) ]; then \
		level=$$(cat $(SKILLS_FILE) | grep -o '"level":"[^"]*"' | cut -d'"' -f4 || echo "Aspiring Developer"); \
		xp=$$(cat $(SKILLS_FILE) | grep -o '"xp":[0-9]*' | cut -d':' -f2 || echo "0"); \
		commands=$$(cat $(SKILLS_FILE) | grep -o '"commands_used":\[[^\]]*\]' | grep -o ',' | wc -l 2>/dev/null || echo "0"); \
		commands=$$((commands + 1)); \
		[ -z "$$xp" ] && xp=0; \
		[ -z "$$level" ] && level="Aspiring Developer"; \
		echo "$(BOLD)Level:$(RESET) $$level"; \
		echo "$(BOLD)Experience Points:$(RESET) $$xp XP"; \
		echo "$(BOLD)Commands Mastered:$(RESET) $$commands"; \
		echo ""; \
		if [ "$$xp" -lt $(BEGINNER_XP) ]; then \
			echo "$(YELLOW)🌱 Next Level: Beginner Developer ($$(($(BEGINNER_XP) - xp)) XP to go)$(RESET)"; \
		elif [ "$$xp" -lt $(INTERMEDIATE_XP) ]; then \
			echo "$(BLUE)🚀 Next Level: Intermediate Developer ($$(($(INTERMEDIATE_XP) - xp)) XP to go)$(RESET)"; \
		elif [ "$$xp" -lt $(ADVANCED_XP) ]; then \
			echo "$(PURPLE)⚡ Next Level: Advanced Developer ($$(($(ADVANCED_XP) - xp)) XP to go)$(RESET)"; \
		elif [ "$$xp" -lt $(EXPERT_XP) ]; then \
			echo "$(RED)🏆 Next Level: Expert Developer ($$(($(EXPERT_XP) - xp)) XP to go)$(RESET)"; \
		else \
			echo "$(BOLD)$(GREEN)🌟 You are a Development Master! Keep growing! 🌟$(RESET)"; \
		fi; \
	else \
		echo "$(YELLOW)Run 'make journey' to start tracking your progress!$(RESET)"; \
	fi
	@echo ""

# 🏆 Display achievements
achievements:
	@echo "$(BOLD)$(YELLOW)🏆 Your Achievements$(RESET)"
	@echo ""
	@if [ -f $(ACHIEVEMENTS_FILE) ]; then \
		if [ -s $(ACHIEVEMENTS_FILE) ]; then \
			cat $(ACHIEVEMENTS_FILE); \
		else \
			echo "$(CYAN)No achievements yet! Start using commands to unlock them.$(RESET)"; \
		fi; \
	else \
		echo "$(YELLOW)Run 'make journey' to start earning achievements!$(RESET)"; \
	fi
	@echo ""

# 📊 Track command usage and award XP
define track_command
	@mkdir -p $(PROGRESS_DIR)
	@if [ -f $(SKILLS_FILE) ]; then \
		xp=$$(cat $(SKILLS_FILE) | grep -o '"xp":[0-9]*' | cut -d':' -f2); \
		new_xp=$$((xp + $(2))); \
		temp_file=$$(mktemp); \
		cat $(SKILLS_FILE) | sed 's/"xp":[0-9]*/"xp":'"$$new_xp"'/' > $$temp_file && mv $$temp_file $(SKILLS_FILE); \
		echo "$$(date): $(1) (+$(2) XP)" >> $(LOG_FILE); \
		if [ $$new_xp -ge $(BEGINNER_XP) ] && [ $$xp -lt $(BEGINNER_XP) ]; then \
			echo "🎉 LEVEL UP: Beginner Developer unlocked!" >> $(ACHIEVEMENTS_FILE); \
			temp_file=$$(mktemp); \
			cat $(SKILLS_FILE) | sed 's/"level":"[^"]*"/"level":"Beginner Developer"/' > $$temp_file && mv $$temp_file $(SKILLS_FILE); \
		fi; \
		if [ $$new_xp -ge $(INTERMEDIATE_XP) ] && [ $$xp -lt $(INTERMEDIATE_XP) ]; then \
			echo "🚀 LEVEL UP: Intermediate Developer unlocked!" >> $(ACHIEVEMENTS_FILE); \
			temp_file=$$(mktemp); \
			cat $(SKILLS_FILE) | sed 's/"level":"[^"]*"/"level":"Intermediate Developer"/' > $$temp_file && mv $$temp_file $(SKILLS_FILE); \
		fi; \
		if [ $$new_xp -ge $(ADVANCED_XP) ] && [ $$xp -lt $(ADVANCED_XP) ]; then \
			echo "⚡ LEVEL UP: Advanced Developer unlocked!" >> $(ACHIEVEMENTS_FILE); \
			temp_file=$$(mktemp); \
			cat $(SKILLS_FILE) | sed 's/"level":"[^"]*"/"level":"Advanced Developer"/' > $$temp_file && mv $$temp_file $(SKILLS_FILE); \
		fi; \
		if [ $$new_xp -ge $(EXPERT_XP) ] && [ $$xp -lt $(EXPERT_XP) ]; then \
			echo "🏆 LEVEL UP: Expert Developer - You are a master!" >> $(ACHIEVEMENTS_FILE); \
			temp_file=$$(mktemp); \
			cat $(SKILLS_FILE) | sed 's/"level":"[^"]*"/"level":"Expert Developer"/' > $$temp_file && mv $$temp_file $(SKILLS_FILE); \
		fi; \
	fi
endef

# 🔧 Setup development environment
setup:
	@echo "$(BOLD)$(CYAN)🔧 Setting up your development environment...$(RESET)"
	@$(MAKE) journey
	@echo "$(GREEN)✅ Checking Node.js version...$(RESET)"
	@node_version=$$(node --version 2>/dev/null | sed 's/v//'); \
	if [ -z "$$node_version" ]; then \
		echo "$(RED)❌ Node.js not found. Please install Node.js 22 LTS$(RESET)"; \
		exit 1; \
	else \
		echo "$(CYAN)Found Node.js $$node_version$(RESET)"; \
		major_version=$$(echo $$node_version | cut -d'.' -f1); \
		if [ "$$major_version" -lt 18 ]; then \
			echo "$(YELLOW)⚠️  Node.js $$node_version detected. Recommended: v22 LTS$(RESET)"; \
		fi; \
	fi
	@echo "$(GREEN)✅ Checking npm version...$(RESET)"
	@npm_version=$$(npm --version 2>/dev/null); \
	if [ -z "$$npm_version" ]; then \
		echo "$(YELLOW)⚠️  npm path issue detected$(RESET)"; \
		echo "$(CYAN)Trying alternative npm detection...$(RESET)"; \
		if which npm >/dev/null 2>&1; then \
			npm_path=$$(which npm); \
			echo "$(CYAN)npm found at: $$npm_path$(RESET)"; \
			echo "$(YELLOW)Run './fix-npm.sh' to resolve npm path issues$(RESET)"; \
		else \
			echo "$(RED)❌ npm not found in PATH$(RESET)"; \
			exit 1; \
		fi; \
	else \
		echo "$(CYAN)Found npm $$npm_version$(RESET)"; \
	fi
	@echo "$(GREEN)✅ Checking Docker...$(RESET)"
	@docker --version || echo "$(YELLOW)⚠️  Docker not found. Install Docker for container features$(RESET)"
	@echo "$(GREEN)✅ Setting up environment files...$(RESET)"
	@$(MAKE) setup-env
	@echo "$(GREEN)🎉 Development environment ready!$(RESET)"
	$(call track_command,"Environment setup completed",25)

# 🔐 Setup environment files
setup-env:
	@echo "$(CYAN)🔐 Setting up environment configuration files...$(RESET)"
	@./setup-env-standalone.sh

# 📦 Install dependencies with progress
install:
	@echo "$(BOLD)$(BLUE)📦 Installing dependencies...$(RESET)"
	@echo "$(YELLOW)This might take a moment. Perfect time for a coffee! ☕$(RESET)"
	@npm install
	@echo "$(GREEN)✅ Dependencies installed successfully!$(RESET)"
	$(call track_command,"Dependencies installed",30)
	@if ! grep -q "Package Manager" $(ACHIEVEMENTS_FILE) 2>/dev/null; then \
		echo "🎯 ACHIEVEMENT UNLOCKED: Package Manager - Dependencies mastered!" >> $(ACHIEVEMENTS_FILE); \
	fi

# 🎮 Start development servers
dev:
	@echo "$(BOLD)$(GREEN)🎮 Starting development servers...$(RESET)"
	@echo "$(CYAN)Frontend: http://localhost:3000$(RESET)"
	@echo "$(CYAN)Backend:  http://localhost:8787$(RESET)"
	@echo "$(YELLOW)Press Ctrl+C to stop servers$(RESET)"
	@npm run dev || echo "$(RED)❌ Development servers failed to start$(RESET)"
	$(call track_command,"Development servers launched",20)
	@if ! grep -q "Quick Starter" $(ACHIEVEMENTS_FILE) 2>/dev/null; then \
		echo "🚀 ACHIEVEMENT UNLOCKED: Quick Starter - Development environment launched!" >> $(ACHIEVEMENTS_FILE); \
	fi

# 📝 View development logs
dev-logs:
	@echo "$(BOLD)$(PURPLE)📝 Development Logs$(RESET)"
	@if [ -f $(LOG_FILE) ]; then \
		echo "$(CYAN)Recent activity:$(RESET)"; \
		tail -10 $(LOG_FILE); \
	else \
		echo "$(YELLOW)No logs yet. Run 'make journey' to start tracking!$(RESET)"; \
	fi

# 🔨 Build Docker images
docker-build:
	@echo "$(BOLD)$(BLUE)🔨 Building Docker images...$(RESET)"
	@echo "$(YELLOW)Building frontend image...$(RESET)"
	@docker build -t $(FRONTEND_IMAGE) ./frontend
	@echo "$(YELLOW)Building backend image...$(RESET)"
	@docker build -t $(BACKEND_IMAGE) ./server
	@echo "$(GREEN)🎉 Docker images built successfully!$(RESET)"
	$(call track_command,"Docker images built",40)
	@if ! grep -q "Container Architect" $(ACHIEVEMENTS_FILE) 2>/dev/null; then \
		echo "🐳 ACHIEVEMENT UNLOCKED: Container Architect - Docker mastery achieved!" >> $(ACHIEVEMENTS_FILE); \
	fi

# 🚀 Launch containerized environment
docker-up:
	@echo "$(BOLD)$(GREEN)🚀 Launching containerized environment...$(RESET)"
	@docker network create $(DOCKER_NETWORK) 2>/dev/null || true
	@echo "$(CYAN)Starting backend container...$(RESET)"
	@docker run -d --name $(BACKEND_CONTAINER) --network $(DOCKER_NETWORK) -p 8787:8787 \
		-e NODE_ENV=development \
		-e PORT=8787 \
		$(BACKEND_IMAGE)
	@echo "$(CYAN)Starting frontend container...$(RESET)"
	@docker run -d --name $(FRONTEND_CONTAINER) --network $(DOCKER_NETWORK) -p 3000:80 \
		-e VITE_API_BASE_URL=http://localhost:8787/api \
		$(FRONTEND_IMAGE)
	@echo ""
	@echo "$(BOLD)$(GREEN)🎉 Environment launched successfully!$(RESET)"
	@echo "$(CYAN)Frontend: http://localhost:3000$(RESET)"
	@echo "$(CYAN)Backend:  http://localhost:8787$(RESET)"
	@echo "$(YELLOW)Use 'make docker-logs' to monitor logs$(RESET)"
	$(call track_command,"Container environment launched",35)
	@if ! grep -q "Docker Captain" $(ACHIEVEMENTS_FILE) 2>/dev/null; then \
		echo "⛵ ACHIEVEMENT UNLOCKED: Docker Captain - Full container orchestration!" >> $(ACHIEVEMENTS_FILE); \
	fi

# 📥 Stop and clean containers
docker-down:
	@echo "$(BOLD)$(YELLOW)📥 Stopping containers gracefully...$(RESET)"
	@docker stop $(FRONTEND_CONTAINER) $(BACKEND_CONTAINER) 2>/dev/null || true
	@docker rm $(FRONTEND_CONTAINER) $(BACKEND_CONTAINER) 2>/dev/null || true
	@docker network rm $(DOCKER_NETWORK) 2>/dev/null || true
	@echo "$(GREEN)✅ Containers stopped and cleaned up$(RESET)"
	$(call track_command,"Container cleanup completed",10)

# 🔍 View container logs
docker-logs:
	@echo "$(BOLD)$(PURPLE)🔍 Container Logs$(RESET)"
	@echo "$(CYAN)Backend logs:$(RESET)"
	@docker logs $(BACKEND_CONTAINER) --tail=20 2>/dev/null || echo "$(YELLOW)Backend container not running$(RESET)"
	@echo ""
	@echo "$(CYAN)Frontend logs:$(RESET)"
	@docker logs $(FRONTEND_CONTAINER) --tail=20 2>/dev/null || echo "$(YELLOW)Frontend container not running$(RESET)"

# 🐚 Enter container shell for debugging
docker-shell:
	@echo "$(BOLD)$(CYAN)🐚 Entering backend container shell...$(RESET)"
	@docker exec -it $(BACKEND_CONTAINER) /bin/sh || echo "$(RED)❌ Backend container not running$(RESET)"
	$(call track_command,"Container debugging session",15)

# 🧪 Run test suite
test:
	@echo "$(BOLD)$(BLUE)🧪 Running test suite...$(RESET)"
	@echo "$(YELLOW)Quality is not an accident, it's a habit! 💪$(RESET)"
	@npm run test
	@echo "$(GREEN)✅ Tests completed!$(RESET)"
	$(call track_command,"Test suite executed",25)
	@if ! grep -q "Quality Guardian" $(ACHIEVEMENTS_FILE) 2>/dev/null; then \
		echo "🛡️  ACHIEVEMENT UNLOCKED: Quality Guardian - Testing excellence achieved!" >> $(ACHIEVEMENTS_FILE); \
	fi

# ✨ Code quality and linting
lint:
	@echo "$(BOLD)$(PURPLE)✨ Checking code quality...$(RESET)"
	@npm run lint
	@echo "$(GREEN)✅ Code quality check completed!$(RESET)"
	$(call track_command,"Code linting completed",15)

# 🔍 TypeScript type checking
typecheck:
	@echo "$(BOLD)$(BLUE)🔍 Checking TypeScript types...$(RESET)"
	@npm run typecheck
	@echo "$(GREEN)✅ Type checking completed!$(RESET)"
	$(call track_command,"TypeScript validation completed",20)

# 🛡️ Security audit
security:
	@echo "$(BOLD)$(RED)🛡️  Running security audit...$(RESET)"
	@npm audit --audit-level=high
	@echo "$(GREEN)✅ Security audit completed!$(RESET)"
	$(call track_command,"Security audit performed",30)
	@if ! grep -q "Security Expert" $(ACHIEVEMENTS_FILE) 2>/dev/null; then \
		echo "🔒 ACHIEVEMENT UNLOCKED: Security Expert - Security-first mindset!" >> $(ACHIEVEMENTS_FILE); \
	fi

# ⚡ Performance analysis
performance:
	@echo "$(BOLD)$(YELLOW)⚡ Analyzing performance...$(RESET)"
	@npm run build:frontend
	@echo "$(CYAN)Bundle analysis:$(RESET)"
	@du -h frontend/dist/assets/* 2>/dev/null || echo "$(YELLOW)Build assets not found$(RESET)"
	@echo "$(GREEN)✅ Performance analysis completed!$(RESET)"
	$(call track_command,"Performance analysis completed",25)

# 📦 Production build
build:
	@echo "$(BOLD)$(GREEN)📦 Creating production build...$(RESET)"
	@echo "$(YELLOW)Building for production excellence! 🏗️$(RESET)"
	@npm run build:frontend && npm run build:server
	@echo "$(GREEN)🎉 Production build completed!$(RESET)"
	$(call track_command,"Production build created",35)
	@if ! grep -q "Build Master" $(ACHIEVEMENTS_FILE) 2>/dev/null; then \
		echo "🏗️  ACHIEVEMENT UNLOCKED: Build Master - Production ready!" >> $(ACHIEVEMENTS_FILE); \
	fi

# 🌐 Deploy to production
deploy:
	@echo "$(BOLD)$(CYAN)🌐 Deploying to production...$(RESET)"
	@echo "$(YELLOW)Your code is about to impact the world! 🌍$(RESET)"
	@git push
	@echo "$(GREEN)🚀 Deployment initiated!$(RESET)"
	@echo "$(CYAN)Check GitHub Actions for deployment status$(RESET)"
	$(call track_command,"Production deployment initiated",50)
	@if ! grep -q "Deployment Hero" $(ACHIEVEMENTS_FILE) 2>/dev/null; then \
		echo "🦸 ACHIEVEMENT UNLOCKED: Deployment Hero - Production deployment mastered!" >> $(ACHIEVEMENTS_FILE); \
	fi

# 💾 Backup project
backup:
	@echo "$(BOLD)$(PURPLE)💾 Creating project backup...$(RESET)"
	@mkdir -p backups
	@backup_name="backup-$$(date +%Y%m%d-%H%M%S).tar.gz"; \
	tar --exclude='node_modules' --exclude='dist' --exclude='backups' --exclude='.git' \
		-czf "backups/$$backup_name" . && \
	echo "$(GREEN)✅ Backup created: backups/$$backup_name$(RESET)"
	$(call track_command,"Project backup created",20)

# 🔄 Restore from backup
restore:
	@echo "$(BOLD)$(BLUE)🔄 Available backups:$(RESET)"
	@ls -la backups/ 2>/dev/null || echo "$(YELLOW)No backups found$(RESET)"
	@echo "$(CYAN)To restore, extract a backup manually:$(RESET)"
	@echo "$(YELLOW)tar -xzf backups/backup-YYYYMMDD-HHMMSS.tar.gz$(RESET)"

# 🎊 Celebrate achievements
celebrate:
	@echo ""
	@echo "$(BOLD)$(YELLOW)🎊 CELEBRATION TIME! 🎊$(RESET)"
	@echo ""
	@echo "$(CYAN)╔══════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║  🌟 You are an amazing developer! 🌟  ║$(RESET)"
	@echo "$(CYAN)╚══════════════════════════════════════╝$(RESET)"
	@echo ""
	@if [ -f $(SKILLS_FILE) ]; then \
		xp=$$(cat $(SKILLS_FILE) | grep -o '"xp":[0-9]*' | cut -d':' -f2); \
		echo "$(BOLD)Your journey so far: $$xp XP earned!$(RESET)"; \
	fi
	@echo ""
	@echo "$(GREEN)Keep coding, keep growing, keep inspiring! 🚀$(RESET)"
	@echo ""
	$(call track_command,"Celebrated achievements",10)

# 💡 Get motivational wisdom
wisdom:
	@echo ""
	@echo "$(BOLD)$(PURPLE)💡 Developer Wisdom of the Day$(RESET)"
	@echo ""
	@case $$((RANDOM % 10)) in \
		0) echo "$(CYAN)\"Code is poetry written in logic.\" 📝$(RESET)";; \
		1) echo "$(CYAN)\"Every expert was once a beginner.\" 🌱$(RESET)";; \
		2) echo "$(CYAN)\"The best error message is the one that never shows up.\" 🐛$(RESET)";; \
		3) echo "$(CYAN)\"Clean code always looks like it was written by someone who cares.\" ✨$(RESET)";; \
		4) echo "$(CYAN)\"Programming is the art of telling another human what you want the computer to do.\" 🎨$(RESET)";; \
		5) echo "$(CYAN)\"The most important skill for a programmer is the ability to effectively Google.\" 🔍$(RESET)";; \
		6) echo "$(CYAN)\"Good code is its own best documentation.\" 📚$(RESET)";; \
		7) echo "$(CYAN)\"There are only two hard things in Computer Science: cache invalidation and naming things.\" 🤔$(RESET)";; \
		8) echo "$(CYAN)\"Make it work, make it right, make it fast.\" ⚡$(RESET)";; \
		*) echo "$(CYAN)\"A bug is never just a mistake. It represents something bigger. An error of thinking.\" 🔬$(RESET)";; \
	esac
	@echo ""
	$(call track_command,"Gained wisdom",5)

# 🆕 Fresh start (reset progress)
clean-slate:
	@echo "$(BOLD)$(YELLOW)🆕 Starting fresh...$(RESET)"
	@echo "$(RED)This will reset your progress. Are you sure? [y/N]$(RESET)"
	@read -r response; \
	if [ "$$response" = "y" ] || [ "$$response" = "Y" ]; then \
		rm -rf $(PROGRESS_DIR); \
		echo "$(GREEN)✅ Progress reset. Your journey begins anew!$(RESET)"; \
		$(MAKE) journey; \
	else \
		echo "$(CYAN)Operation cancelled. Your progress is safe!$(RESET)"; \
	fi

# 🧹 Clean up development files
clean:
	@echo "$(BOLD)$(YELLOW)🧹 Cleaning up development files...$(RESET)"
	@rm -rf frontend/node_modules server/node_modules
	@rm -rf frontend/dist server/dist
	@docker system prune -f 2>/dev/null || true
	@echo "$(GREEN)✅ Cleanup completed!$(RESET)"
	$(call track_command,"Development cleanup completed",10)

# 🔄 Full reset (clean + fresh install)
reset: clean
	@echo "$(BOLD)$(CYAN)🔄 Full reset initiated...$(RESET)"
	@$(MAKE) setup
	@$(MAKE) install
	@echo "$(GREEN)🎉 Full reset completed! Ready for development!$(RESET)"
	$(call track_command,"Full environment reset",40)

# 🚀 Quick start for newcomers
quickstart:
	@echo "$(BOLD)$(GREEN)🚀 Quick Start for New Developers!$(RESET)"
	@echo ""
	@echo "$(CYAN)This will set up everything you need:$(RESET)"
	@echo "1. 🔧 Setup environment"
	@echo "2. 📦 Install dependencies"
	@echo "3. 🎮 Start development"
	@echo ""
	@$(MAKE) setup
	@$(MAKE) install
	@$(MAKE) dev

# 📈 Show detailed progress report
report:
	@echo "$(BOLD)$(BLUE)📈 Your Developer Progress Report$(RESET)"
	@echo ""
	@$(MAKE) skills
	@echo "$(BOLD)Recent Activity:$(RESET)"
	@if [ -f $(LOG_FILE) ]; then \
		tail -5 $(LOG_FILE) | sed 's/^/  /'; \
	fi
	@echo ""
	@$(MAKE) achievements