pipeline {
  agent any

  environment {
    IMAGE_NAME = 'mappy-web-app'
    CONTAINER_NAME = 'mappy-web-container'
    APP_PORT = '3000'
  }

  stages {
    stage('Install Web Dependencies') {
      steps {
        cleanWs()
        echo '📦 Installing web dependencies...'
        dir('web') {
          bat 'npm install'
        }
      }
    }

    stage('Build Web App') {
      steps {
        echo '🏗️ Building production build...'
        dir('web') {
          bat 'npm run build'
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        echo '🐳 Building Docker image...'
        dir('web') {
          bat "docker build -t %IMAGE_NAME% ."
        }
      }
    }

    stage('Run Docker Container') {
      steps {
        echo '🚀 Running Docker container...'
        bat "docker rm -f %CONTAINER_NAME% || exit 0"
        bat "docker run -d -p %APP_PORT%:3000 --name %CONTAINER_NAME% %IMAGE_NAME%"
      }
    }
  }

  post {
    success {
      echo '✅ Application is running in Docker at http://localhost:3000'
    }
    failure {
      echo '❌ Pipeline failed. Check logs for details.'
    }
  }
}
