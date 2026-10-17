pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-south-1'
        ECR_REPO_NAME      = 'gitstory-app'
        EKS_CLUSTER_NAME   = 'arjuna-buildathon-eks-cluster'
        K8S_NAMESPACE      = 'gitstory-prod'
        IMAGE_TAG          = '1.0.0'
    }

    stages {
        stage('Validate & Install') {
            steps {
                echo 'Checking Node & NPM environment...'
                sh 'node -v && npm -v'
                sh 'npm ci --prefer-offline --no-audit --ignore-scripts'
            }
        }

        stage('Quality & Unit Tests') {
            steps {
                echo 'Running lint and test suites...'
                sh 'npm run lint'
                sh 'npx vitest run'
            }
        }

        stage('Build Next.js Bundle') {
            steps {
                echo 'Compiling Next.js 16 standalone production build...'
                sh 'npm run build'
            }
        }

        stage('Docker Packaging') {
            steps {
                echo 'Building production Docker image...'
                sh 'docker build -t arjuna-1/gitstory:1.0.0 .'
            }
        }

        stage('Deploy to AWS EKS') {
            steps {
                echo 'Applying Kubernetes feature ReplicaSets & Services...'
                sh 'kubectl apply -f k8s/configmap.yaml'
                sh 'kubectl apply -f k8s/secrets.yaml'
                sh 'kubectl apply -f k8s/services.yaml'
                sh 'kubectl apply -f k8s/replicaset-web.yaml'
                sh 'kubectl apply -f k8s/replicaset-api-telemetry.yaml'
                sh 'kubectl apply -f k8s/replicaset-ai-assistant.yaml'
                sh 'kubectl apply -f k8s/ingress.yaml'
                sh 'kubectl apply -f k8s/hpa.yaml'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Verifying deployment rollout...'
                sh 'kubectl get pods -n gitstory-prod'
            }
        }
    }
}
