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
          bat 'start /b npm run dev'
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
