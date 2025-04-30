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
          bat 'start /b npm run dev -- --hostname 0.0.0.0'
        }
      }
    }

    stage('Install Backend Dependencies') {
      steps {
        echo '📥 Installing dependencies for API...'
        dir('api') {
          bat 'python -m pip install -r requirements.txt'
        }
      }
    }

    stage('Start Backend') {
      steps {
        echo '🚀 Starting Flask API...'
        dir('api') {
          withEnv(['JENKINS_NODE_COOKIE=dontKillMe']) {
            bat 'start /b python -m flask run --debug --port=8321 --host=0.0.0.0'
          }
        }
      }
    }
  }

  post {
    success {
      echo '✅ Web app is running on http://localhost:3000'
      echo '✅ API is running on http://localhost:8321'
    }
    failure {
      echo '❌ Pipeline failed; check console logs.'
    }
  }
}

