#!/usr/bin/env python3
"""
FinanceBot Backend Setup Script
This script helps set up and run the FastAPI backend server.
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def check_python_version():
    """Check if Python 3.8+ is installed"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        sys.exit(1)
    print(f"✅ Python {sys.version.split()[0]} detected")

def create_virtual_environment():
    """Create a virtual environment"""
    venv_path = Path("venv")
    if not venv_path.exists():
        print("📦 Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print("✅ Virtual environment created")
    else:
        print("✅ Virtual environment already exists")

def get_pip_path():
    """Get the path to pip in the virtual environment"""
    if os.name == 'nt':  # Windows
        return Path("venv/Scripts/pip")
    else:  # Unix/Linux/macOS
        return Path("venv/bin/pip")

def get_python_path():
    """Get the path to python in the virtual environment"""
    if os.name == 'nt':  # Windows
        return Path("venv/Scripts/python")
    else:  # Unix/Linux/macOS
        return Path("venv/bin/python")

def install_dependencies():
    """Install required dependencies"""
    pip_path = get_pip_path()
    if not pip_path.exists():
        print("❌ Virtual environment not properly created")
        sys.exit(1)
    
    print("📦 Installing dependencies...")
    subprocess.run([str(pip_path), "install", "-r", "requirements.txt"], check=True)
    print("✅ Dependencies installed")

def setup_environment():
    """Set up environment variables"""
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if not env_file.exists() and env_example.exists():
        print("⚙️ Setting up environment variables...")
        shutil.copy(env_example, env_file)
        print("✅ Environment file created (.env)")
        print("⚠️  Please update .env file with your database credentials if using PostgreSQL")
    elif env_file.exists():
        print("✅ Environment file already exists")
    else:
        print("⚠️  No .env.example found, creating basic .env file...")
        with open(env_file, "w") as f:
            f.write("DATABASE_URL=sqlite:///./financebot.db\n")
            f.write("SECRET_KEY=your-secret-key-change-in-production\n")
        print("✅ Basic .env file created")

def run_server():
    """Run the FastAPI server"""
    python_path = get_python_path()
    print("🚀 Starting FastAPI server...")
    print("Server will be available at: http://localhost:8000")
    print("API documentation: http://localhost:8000/docs")
    print("Press Ctrl+C to stop the server")
    
    try:
        subprocess.run([str(python_path), "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped")

def main():
    """Main setup function"""
    print("🔧 FinanceBot Backend Setup")
    print("=" * 40)
    
    # Change to the backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    check_python_version()
    create_virtual_environment()
    install_dependencies()
    setup_environment()
    
    print("\n✅ Setup complete!")
    print("\n" + "=" * 40)
    
    # Ask if user wants to run the server
    run_now = input("Do you want to start the server now? (y/N): ").lower().strip()
    if run_now in ['y', 'yes']:
        run_server()
    else:
        print("\nTo start the server later, run:")
        print("  cd backend")
        if os.name == 'nt':
            print("  venv\\Scripts\\python -m uvicorn main:app --reload")
        else:
            print("  venv/bin/python -m uvicorn main:app --reload")

if __name__ == "__main__":
    main()
