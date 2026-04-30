# ========================================
# GUÍA DE DEPLOY - TYSON STYLES
# ========================================

## 1. CREAR BASE DE DATOS (Neon - Gratis)

1. Ir a: https://neon.tech
2. Login con GitHub
3. Crear nuevo proyecto:
   - Name: tyson-styles
   - Region: US East (o el más cercano)
4. Copiar la URL de conexión (Database URL)
   - Formato: postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/tyson-styles

## 2. DEPLOYAR BACKEND (Koyeb - Gratis)

1. Ir a: https://koyeb.com
2. Login con GitHub
3. Click "Create App"
4. Seleccionar:
   - Repository: tu-repo/tyson-styles
   - Branch: main
   - Root Directory: backend
   - Environment: Node.js
5. En "Variables" agregar:
   - DATABASE_URL = (pegar la URL de Neon)
   - JWT_SECRET = cualquier-string-secreto-largo
   - ADMIN_API_KEY = tyson_admin
   - NODE_ENV = production
   - FRONTEND_URL = https://tyson-styles.vercel.app
6. Click "Deploy"

## 3. DEPLOYAR FRONTEND (Vercel - Gratis)

1. Ir a: https://vercel.com
2. Importar el repositorio
3. Configurar:
   - Framework: Vite
   - Build Command: npm run build
   - Output Directory: dist/client
4. En "Environment Variables" agregar:
   - VITE_API_URL = (URL de Koyeb, ej: https://tyson-styles-xxx.koyeb.app)
5. Click "Deploy"

## 4. ACTUALIZAR URLs

Una vez deployed:
- Copiar URL del backend de Koyeb
- Ir a Vercel y actualizar VITE_API_URL con la URL real
- Redeploy