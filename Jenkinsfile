pipeline {
  agent any

  environment {
    NODE_ENV = 'development'
  }

  stages {
    stage('Install Web Dependencies') {
      steps {
        echo '📥 Installing dependencies for web...'
        dir('web') {
          bat 'npm install'
        }
      }
    }

    stage('Start Web App') {
      steps {
        echo '🚀 Starting web app...'
        dir('web') {
          bat 'npm run dev'
        }
      }
    }
    stages('start the backend') {
      steps {
        echo ' installing the packages '
        dir ('api') {
          bat ' pip install -r requirements.txt '
          bat ' flask run --debug --port 8321 '
        }
      }  
    }
  }
    
  post {
    success {
      echo '✅ Web app is running on http://localhost:3000'
    }
    failure {
      echo '❌ Pipeline failed; check console logs.'
    }
  }
}
