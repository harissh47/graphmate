pipeline {
  agent any

  environment {
    NODE_ENV = 'development'    // applies to both web and api
  }

  stages {
    // —— Web stages ——
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
          // run dev server in background so pipeline can proceed
          bat 'start /b npm run dev -- --hostname 0.0.0.0'
        }
      }
    }

    // —— Backend stages ——
    stage('Install Backend Dependencies') {
      steps {
        echo '📥 Installing dependencies for API...'
        dir('api') {
          bat 'pip install -r requirements.txt'
        }
      }
    }

    stage('Start Backend') {
      steps {
        echo '🚀 Starting Flask API...'
        dir('api') {
          // run flask in background; adjust if you use virtualenv
          bat 'start /b flask run --debug --port 8321 --host=0.0.0.0'
        }
      }
    }
  }

  post {
    success {
      echo '✅ Web on http://<host>:3000 and API on http://<host>:8321'
    }
    failure {
      echo '❌ Pipeline failed; check console logs.'
    }
  }
}

