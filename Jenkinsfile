
pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.ci.yml'
        APP_BASE_URL = 'http://localhost:8081'
    }

    options {
        timestamps()
        ansiColor('xterm')
    }

    triggers {
        githubPush()  // Auto-trigger on every push
    }

    stages {

        stage('Checkout') {
            steps {
                echo "🔄 Checking out latest code..."
                checkout scm
                sh 'pwd && ls -la'
            }
        }

        stage('Docker Info') {
            steps {
                sh 'docker version'
                sh 'docker compose version'
            }
        }

        stage('Stop Previous Containers') {
            steps {
                echo "🧹 Stopping any running containers..."
                sh "docker compose -f ${DOCKER_COMPOSE_FILE} down --remove-orphans || true"
            }
        }

        stage('Prepare .env') {
            steps {
                echo "🧾 Creating .env file for frontend..."
                withCredentials([
                    string(credentialsId: 'supabase-url', variable: 'SUPABASE_URL'),
                    string(credentialsId: 'supabase-key', variable: 'SUPABASE_KEY'),
                    string(credentialsId: 'supabase-project-id', variable: 'SUPABASE_PROJECT_ID')
                ]) {
                    sh '''
                    cat > .env <<EOF
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_PUBLISHABLE_KEY=${SUPABASE_KEY}
VITE_SUPABASE_PROJECT_ID=${SUPABASE_PROJECT_ID}
EOF
                    echo "✅ .env created successfully"
                    '''
                }
            }
        }

        stage('Build and Deploy') {
            steps {
                echo "🚀 Building and starting containers..."
                sh "docker compose -f ${DOCKER_COMPOSE_FILE} up -d --build"
            }
        }

        stage('Smoke Test') {
            steps {
                echo "🧪 Checking if app is up..."
                sh '''
                sleep 10
                if curl -I http://localhost:8081 2>/dev/null | grep -q "200"; then
                    echo "✅ App is live!"
                else
                    echo "⚠️ App did not respond as expected."
                fi
                '''
            }
        }

        stage('UI Tests') {
            steps {
                echo "🧪 Running Selenium UI tests in headless Chrome container..."
                sh '''
                set -e
                                mkdir -p selenium-tests/target .m2
                docker run --rm --network host \
                                    -e BASE_URL="${APP_BASE_URL}" \
                                    -v "$PWD/selenium-tests:/workspace" \
                                    -v "$PWD/.m2":/root/.m2 \
                                    markhobson/maven-chrome:latest \
                                    /bin/bash -lc 'cd /workspace && set -o pipefail && mvn test -DbaseUrl=$BASE_URL | tee target/ui-tests.log'
                '''
            }
        }
    }

    post {
        always {
            script {
                junit allowEmptyResults: true, testResults: 'selenium-tests/target/surefire-reports/*.xml'

                String recipient = ''
                try {
                    recipient = sh(returnStdout: true, script: "git log -1 --pretty=format:'%ae'").trim()
                } catch (Exception ignored) {
                    echo '⚠️ Unable to determine committer email.'
                }

                boolean logExists = fileExists('selenium-tests/target/ui-tests.log')

                if (recipient) {
                    def mailArgs = [
                        to: recipient,
                        subject: "Auto Suite Pipeline #${env.BUILD_NUMBER}: ${currentBuild.currentResult}",
                        body: """Hello,\n\nThe Jenkins pipeline for Auto Suite has completed with status: ${currentBuild.currentResult}.\n\n- Build URL: ${env.BUILD_URL}\n- Commit: ${env.GIT_COMMIT}\n- Tests: ${currentBuild.currentResult == 'SUCCESS' ? 'Passed' : 'Check reports'}\n\nYou can review the detailed logs and JUnit report in Jenkins.\n\nRegards,\nAuto Suite CI"""
                    ]

                    if (logExists) {
                        mailArgs['attachmentsPattern'] = 'selenium-tests/target/ui-tests.log'
                    }

                    try {
                        emailext mailArgs
                    } catch (Exception mailError) {
                        echo "⚠️ Failed to send notification email: ${mailError.message}"
                    }
                }
            }
        }
        success {
            echo "✅ Deployment completed successfully! Visit: http://<your-ec2-ip>:8081"
        }
        failure {
            echo "❌ Build or deployment failed. Check logs."
        }
    }
}
