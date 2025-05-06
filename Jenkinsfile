pipeline {
  agent any

  environment {
    IMAGE_NAME     = 'mappy-web-app'
    APP_PORT       = '3000'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm                                     // repo → workspace root :contentReference[oaicite:2]{index=2}
      }
    }

    stage('Install & Build') {
      agent {
        docker {
          image 'node:18-alpine'                        // Node.js environment :contentReference[oaicite:3]{index=3}
          args  '-v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
      steps {
        dir('web') {                                    // web/ holds package.json 
          sh 'npm install'                              // install deps 
          sh 'npm run build'                            // production build 
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        dir('web') {
          script {
            // ← CORRECTED: no stray “:contentRe”
            IMAGE = docker.build("${env.IMAGE_NAME}:${env.BUILD_NUMBER}", ".")  :contentReference[oaicite:7]{index=7}
          }
        }
      }
    }

    stage('Run Docker Container') {
      steps {
        script {
          sh "docker rm -f ${env.IMAGE_NAME} || true"    // cleanup old container :contentReference[oaicite:8]{index=8}
          sh "docker run -d -p ${env.APP_PORT}:3000 --name ${env.IMAGE_NAME} ${env.IMAGE_NAME}:${env.BUILD_NUMBER}"  :contentReference[oaicite:9]{index=9}
        }
      }
    }
  }

  post {
    success {
      echo "✅ App running at http://<jenkins-host>:${env.APP_PORT}"
    }
    failure {
      echo "❌ Pipeline failed—see console for errors."
    }
  }
}

