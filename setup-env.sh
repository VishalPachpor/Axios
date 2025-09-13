#!/bin/bash

echo "🚀 Setting up environment file..."

# Copy template to .env.local
cp env.template .env.local

echo "✅ Created .env.local from template"
echo ""
echo "📝 Next steps:"
echo "1. Open .env.local in your editor"
echo "2. Replace the Supabase placeholders with your actual credentials:"
echo "   - NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here"
echo "   - SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here"
echo ""
echo "3. Save the file and restart your dev server: pnpm run dev"
echo ""
echo "🔗 Get your credentials from: https://supabase.com/dashboard"
echo "   → Your Project → Settings → API"
