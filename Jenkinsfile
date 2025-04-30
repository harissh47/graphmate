pipeline {
  agent any

  stages {
    stage('Run Both Services') {
      steps {
        echo '🚀 Launching frontend & backend via run-all.bat'
        bat 'run-all.bat'
      }
    }
  }

  post {
    success {
      echo '✅ Both services launched; frontend on :3000, backend on :8321'
    }
    failure {
      echo '❌ Failed to launch services.'
    }
  }
}
