pipeline {
  agent any

  environment {
    // Name for the built Docker image
    IMAGE_NAME = "my-node-app"
    // Container port to expose
    APP_PORT   = "3000"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm                                             // clone your repo :contentReference[oaicite:4]{index=4}
      }
    }

    stage('Install & Build') {
      // run inside official Node.js image, with Docker socket mounted
      agent {
        docker {
          image 'node:18-alpine'
          args  '-v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
      steps {
        dir('web') {                                            // switch into web/ where package.json lives 
          sh 'npm install'                                      // install dependencies 
          sh 'npm run build'                                    // build production assets 
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        dir('web') {
          script {
            // build image and tag with build number
            IMAGE = docker.build("${env.IMAGE_NAME}:${env.BUILD_NUMBER}", ".")  :contentReference[oaicite:8]{index=8}
          }
        }
      }
    }

    stage('Run Docker Container') {
      steps {
        script {
          // remove old container if exists
          sh "docker rm -f ${env.IMAGE_NAME} || true"          :contentReference[oaicite:9]{index=9}
          // run new container, map host port to container port
          sh "docker run -d -p ${env.APP_PORT}:3000 --name ${env.IMAGE_NAME} ${env.IMAGE_NAME}:${env.BUILD_NUMBER}"  :contentReference[oaicite:10]{index=10}
        }
      }
    }
  }

  post {
    success {
      echo "✅ Application is running at http://<jenkins-host>:${env.APP_PORT}"
    }
    failure {
      echo "❌ Pipeline failed—see console output for details."
    }
  }
}

