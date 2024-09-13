#!/bin/zsh

# Create main project directory
mkdir -p abstracta-feedback
cd abstracta-feedback

# Create subdirectories
mkdir -p components pages/api/auth pages/api/feedback pages/api/admin lib config prisma __tests__/components __tests__/pages/api/feedback styles

# Pages
echo "// Content of index.js" > pages/index.js


# Lib
echo "// Content of validationMiddleware.js" > lib/validationMiddleware.js


# Styles
echo "/* Content of globals.css */" > styles/globals.css

# Root files
echo "# Example environment variables" > .env.example
echo "// Content of jest.setup.js" > jest.setup.js
echo "// Content of next.config.js" > next.config.js
