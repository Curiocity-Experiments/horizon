#!/bin/zsh

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to check if a file exists
check_file() {
    if [[ -f "$1" ]]; then
        echo "${GREEN}✓${NC} $1 exists"
    else
        echo "${RED}✗${NC} $1 is missing"
    fi
}

# Function to check if a directory exists
check_directory() {
    if [[ -d "$1" ]]; then
        echo "${GREEN}✓${NC} $1 directory exists"
    else
        echo "${RED}✗${NC} $1 directory is missing"
    fi
}

# Start checking
echo "Checking Abstracta Feedback project structure..."

# Check root files
check_file ".env.example"
check_file ".gitignore"
check_file "jest.config.js"
check_file "jest.setup.js"
check_file "next.config.js"
check_file "package.json"
check_file "README.md"
check_file "CONTRIBUTING.md"

# Check directories
check_directory "components"
check_directory "pages"
check_directory "pages/api"
check_directory "lib"
check_directory "config"
check_directory "prisma"
check_directory "__tests__"
check_directory "styles"

# Check component files
check_file "components/FeedbackList.js"
check_file "components/FeedbackSubmissionForm.js"
check_file "components/Layout.js"
check_file "components/VoteButton.js"

# Check page files
check_file "pages/_app.js"
check_file "pages/_document.js"
check_file "pages/index.js"
check_file "pages/feedback.js"
check_file "pages/submit-feedback.js"
check_file "pages/profile.js"
check_file "pages/admin.js"

# Check API routes
check_file "pages/api/auth/[...nextauth].js"
check_file "pages/api/feedback/create.js"
check_file "pages/api/feedback/list.js"
check_file "pages/api/admin/categories.js"

# Check lib files
check_file "lib/logger.js"
check_file "lib/validationMiddleware.js"

# Check config files
check_file "config/privateLabel.js"

# Check Prisma files
check_file "prisma/schema.prisma"

# Check test files
check_file "__tests__/components/FeedbackList.test.js"
check_file "__tests__/components/FeedbackSubmissionForm.test.js"
check_file "__tests__/pages/api/feedback/list.test.js"
check_file "__tests__/pages/api/feedback/create.test.js"

# Check style files
check_file "styles/globals.css"

echo "Project structure check completed."
