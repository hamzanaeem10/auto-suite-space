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
        githubPush() 
    }

    stages {
        stage('Checkout') {
            steps {
                echo "🔄 Checking out latest code..."
                checkout scm
            }
        }

        stage('Stop Previous Containers') {
            steps {
                echo "🧹 Cleaning up environment..."
                sh "docker compose -f ${DOCKER_COMPOSE_FILE} down --remove-orphans || true"
                // FIX: No sudo here. This works if you ran the chown command on your server once.
                sh "rm -rf selenium-tests/target || true" 
            }
        }

        stage('Prepare .env') {
            steps {
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
                    '''
                }
            }
        }

        stage('Build and Deploy') {
            steps {
                sh "docker compose -f ${DOCKER_COMPOSE_FILE} up -d --build"
            }
        }

        stage('Smoke Test') {
            steps {
                echo "🧪 Waiting for app to respond at ${APP_BASE_URL}..."
                sh '''
                attempt_counter=0
                max_attempts=12
                until $(curl -sSf ${APP_BASE_URL} > /dev/null); do
                    if [ ${attempt_counter} -eq ${max_attempts} ];then
                      echo "❌ App failed to start in time"
                      exit 1
                    fi
                    printf '.'
                    attempt_counter=$(($attempt_counter+1))
                    sleep 5
                done
                echo "✅ App is live!"
                '''
            }
        }

        stage('UI Tests') {
            steps {
                echo "🧪 Running Selenium UI tests..."
                sh '''
                mkdir -p selenium-tests/target .m2
                docker run --rm --network host \
                    --user $(id -u):$(id -g) \
                    -e BASE_URL="${APP_BASE_URL}" \
                    -v "$PWD/selenium-tests:/workspace" \
                    -v "$PWD/.m2":/root/.m2 \
                    markhobson/maven-chrome:latest \
                    /bin/bash -lc 'cd /workspace && mvn test -DbaseUrl=$BASE_URL' | tee selenium-tests/target/ui-tests.log
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'selenium-tests/target/surefire-reports/*.xml'
            
            script {
                // 1. Get the committer email
                String recipient = sh(returnStdout: true, script: "git log -1 --pretty=format:'%ae'").trim()
                
                // 2. Define status variables
                def buildStatus = currentBuild.currentResult 
                def isSuccess = (buildStatus == 'SUCCESS')
                def statusEmoji = isSuccess ? '✅' : '❌'
                def headerColor = isSuccess ? '#28a745' : '#dc3545'

                // 3. Check if log file exists for attachment
                boolean logExists = fileExists('selenium-tests/target/ui-tests.log')

                // 4. Create the HTML Body
                def emailBody = """
                <html>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
                    <div style="background-color: ${headerColor}; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                        <h1 style="margin: 0;">${statusEmoji} Pipeline ${buildStatus}</h1>
                    </div>
                    <div style="padding: 20px; border: 1px solid #ddd; border-top: none; background-color: #f9f9f9;">
                        <p>Hello <strong>${recipient}</strong>,</p>
                        <p>The latest build for <strong>auto-suite-space</strong> has finished. Details are provided below:</p>
                        
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                            <tr style="background-color: #eee;"><td style="padding: 10px; border: 1px solid #ddd;"><strong>Build Number</strong></td><td style="padding: 10px; border: 1px solid #ddd;">#${env.BUILD_NUMBER}</td></tr>
                            <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Status</strong></td><td style="padding: 10px; border: 1px solid #ddd; color: ${headerColor}; font-weight: bold;">${buildStatus}</td></tr>
                            <tr style="background-color: #eee;"><td style="padding: 10px; border: 1px solid #ddd;"><strong>Console Logs</strong></td><td style="padding: 10px; border: 1px solid #ddd;"><a href="${env.BUILD_URL}console">View Jenkins Console</a></td></tr>
                        </table>

                        <p style="margin-top: 20px;"><em>The Selenium UI test log file has been attached to this email for your review.</em></p>
                        
                        <div style="margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px;">
                            Automated notification from Jenkins CI/CD System.
                        </div>
                    </div>
                </body>
                </html>
                """

                // 5. Send the Email
                emailext (
                    to: recipient,
                    subject: "${statusEmoji} ${buildStatus}: Auto Suite Build #${env.BUILD_NUMBER}",
                    body: emailBody,
                    mimeType: 'text/html',
                    attachmentsPattern: 'selenium-tests/target/ui-tests.log'
                )
            }
        }
    }
}
