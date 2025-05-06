pipeline {
  agent any

  environment {
    IMAGE_NAME      = 'mappy-web-app'
    CONTAINER_NAME  = 'mappy-web-container'
    APP_PORT        = '3000'
    NODE_ENV        = 'production'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Build Web') {
      steps {
        dir('web') {
          bat 'npm install'
          bat 'npm run build'
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        dir('web') {
          bat "docker build -t %IMAGE_NAME% ."
        }
      }
    }

    stage('Run Docker Container') {
      steps {
        bat "docker rm -f %CONTAINER_NAME% || exit 0"
        bat "docker run -d -p %APP_PORT%:3000 --name %CONTAINER_NAME% %IMAGE_NAME%"
      }
    }
  }

  post {
    success {
      echo "✅ App running in Docker at http://<jenkins-host>:${env.APP_PORT}"
    }
    failure {
      echo "❌ Pipeline failed—check console logs."
    }
  }
}
