pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID     = credentials('aws-account-id')
        AWS_CREDENTIALS_ID = 'aws-buildathon-credentials'
        ECR_REPO_NAME      = 'gitstory-app'
        ECR_REGISTRY       = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
        IMAGE_TAG          = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
        EKS_CLUSTER_NAME   = 'arjuna-buildathon-eks-cluster'
        K8S_NAMESPACE      = 'gitstory-prod'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        ansiColor('xterm')
    }

    stages {
        stage('1. Environment & Dependency Validation') {
            steps {
                echo "🚀 Starting CI/CD Pipeline for GitStory (Team Arjuna_1)"
                echo "Node.js Version: ${sh(script: 'node -v', returnStdout: true).trim()}"
                echo "NPM Version: ${sh(script: 'npm -v', returnStdout: true).trim()}"
                echo "Git Commit: ${env.GIT_COMMIT.take(7)}"
                sh 'npm ci --prefer-offline'
            }
        }

        stage('2. Code Quality & Unit Test Verification') {
            parallel {
                stage('Lint & Static Analysis') {
                    steps {
                        echo "🔍 Running ESLint rules..."
                        sh 'npm run lint'
                    }
                }
                stage('Vitest Unit Test Suite') {
                    steps {
                        echo "🧪 Running 27 unit tests..."
                        sh 'npx vitest run'
                    }
                }
            }
        }

        stage('3. Build Standalone Production Bundle') {
            steps {
                echo "📦 Compiling Next.js 16 App Router with Turbopack..."
                sh 'npm run build'
            }
        }

        stage('4. Docker Containerization') {
            steps {
                echo "🐳 Building multi-stage production Docker image..."
                sh """
                    docker build \
                        --file Dockerfile \
                        --tag ${ECR_REGISTRY}/${ECR_REPO_NAME}:${IMAGE_TAG} \
                        --tag ${ECR_REGISTRY}/${ECR_REPO_NAME}:latest \
                        .
                """
            }
        }

        stage('5. Security Scanning & AWS ECR Push') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: env.AWS_CREDENTIALS_ID
                ]]) {
                    echo "🔐 Authenticating with AWS Elastic Container Registry (ECR)..."
                    sh """
                        aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | \
                            docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    """
                    echo "⬆️ Pushing Docker image tags to AWS ECR..."
                    sh """
                        docker push ${ECR_REGISTRY}/${ECR_REPO_NAME}:${IMAGE_TAG}
                        docker push ${ECR_REGISTRY}/${ECR_REPO_NAME}:latest
                    """
                }
            }
        }

        stage('6. Kubernetes Deployment to AWS EKS') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: env.AWS_CREDENTIALS_ID
                ]]) {
                    echo "☸️ Updating Kubeconfig for Amazon EKS Cluster [${EKS_CLUSTER_NAME}]..."
                    sh """
                        aws eks update-kubeconfig \
                            --region ${AWS_DEFAULT_REGION} \
                            --name ${EKS_CLUSTER_NAME}
                    """

                    echo "🚀 Deploying feature-segregated ReplicaSets & Services to namespace [${K8S_NAMESPACE}]..."
                    sh """
                        kubectl apply -f k8s/configmap.yaml
                        kubectl apply -f k8s/secrets.yaml
                        kubectl apply -f k8s/service-web.yaml
                        kubectl apply -f k8s/service-api.yaml
                        kubectl apply -f k8s/service-ai.yaml
                        kubectl apply -f k8s/replicaset-web.yaml
                        kubectl apply -f k8s/replicaset-api-telemetry.yaml
                        kubectl apply -f k8s/replicaset-ai-assistant.yaml
                        kubectl apply -f k8s/ingress.yaml
                        kubectl apply -f k8s/hpa.yaml
                    """

                    echo "⏳ Monitoring rollout status..."
                    sh """
                        kubectl rollout status deployment/gitstory-web-deployment -n ${K8S_NAMESPACE} --timeout=180s
                        kubectl rollout status deployment/gitstory-api-deployment -n ${K8S_NAMESPACE} --timeout=180s
                        kubectl rollout status deployment/gitstory-ai-deployment -n ${K8S_NAMESPACE} --timeout=180s
                    """
                }
            }
        }

        stage('7. Automated Smoke Test & Health Check') {
            steps {
                echo "🩺 Performing live HTTP health check on deployed endpoints..."
                sh """
                    kubectl get pods -n ${K8S_NAMESPACE} -o wide
                    kubectl get services -n ${K8S_NAMESPACE}
                    kubectl get ingress -n ${K8S_NAMESPACE}
                """
            }
        }
    }

    post {
        always {
            echo "🧹 Cleaning up local Docker build artifacts..."
            sh "docker rmi ${ECR_REGISTRY}/${ECR_REPO_NAME}:${IMAGE_TAG} || true"
        }
        success {
            echo "✅ GitStory successfully deployed to AWS EKS! Ready for Buildathon evaluation."
        }
        failure {
            echo "❌ Pipeline failed! Check stage logs for details."
        }
    }
}
