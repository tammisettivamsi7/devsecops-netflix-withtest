pipeline {
    agent any
    tools{
        jdk 'jdk21'
        nodejs 'node20'
    }
    environment{
        SCANNER_HOME = tool 'mysonar'
       IMAGE_NAME = 'thammisettivamsi/netflix'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('clean workspace') {
            steps {
                echo '-----start clean workspace----'
                cleanWs()
                echo '---------------stop clean workspace------'
            }
        }
        stage('code checkout'){
            steps{
                git branch: 'main', url: 'https://github.com/tammisettivamsi7/devsecops-netflix-withtest.git'
            }
        }
        stage('install'){
           steps{
               sh 'npm install'
            }
          }
        stage('unit testing'){
            steps{
                sh 'npm run test'
            }
        }
        stage('sonarqube Analysis'){
            steps{
                 withSonarQubeEnv('mysonar') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=Netflix \
                    -Dsonar.projectKey=Netflix '''
                   }
            }
        }
        stage('quality gates'){
            steps{
                script{
                    waitForQualityGate abortPipeline: false, credentialsId: 'sonarid'
                }
            }
        }
        stage('build image'){
            steps{
                sh 'docker build --build-arg TMDB_V3_API_KEY=866940db3c6df4673dc4b64ea7f3ae55 -t ${IMAGE_NAME}:${IMAGE_TAG} . '
            }
        }
        stage('trivy scan'){
            steps{
                sh 'trivy image ${IMAGE_NAME}:${IMAGE_TAG}'
            }
        }
        stage('Push Image') {
           steps {
               withDockerRegistry(credentialsId: 'dockerhub',url: 'https://index.docker.io/v1/') {
                       sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                 }
             }
         }
         stage('deploy to k8s'){
             steps{
                 dir('Kubernetes') {
                 withKubeCredentials(kubectlCredentials: [[caCertificate: '', clusterName: 'EKS-1', contextName: '', credentialsId: 'k8s', namespace: '', serverUrl: 'https://865E04C871ECFD0BA10594EF4EC339E1.gr7.ap-south-1.eks.amazonaws.com']]) {
   
        
           
                sh """
                    sed -i 's|IMAGE_TAG|${IMAGE_TAG}|g' deployment.yml
                    kubectl apply -f deployment.yml
                    kubectl apply -f service.yml
                """
            
    
                 }
             }
            }
              stage('Approval for SIT') {
            steps {
                input message: 'DEV deployment completed. Approve deployment to SIT?',
                      ok: 'Deploy to SIT'
            }
        }
              stage('Deploy to SIT') {
            steps {
                dir('Kubernetes') {

                    withKubeCredentials(
                        kubectlCredentials: [[
                            caCertificate: '',
                            clusterName: 'EKS-1',
                            contextName: '',
                            credentialsId: 'k8s',
                            namespace: '',
                            serverUrl: 'https://865E04C871ECFD0BA10594EF4EC339E1.gr7.ap-south-1.eks.amazonaws.com'
                        ]]
                    ) {

                        sh '''
                            sed -i "s|IMAGE_TAG|${IMAGE_TAG}|g" deployment-sit.yml

                            kubectl apply -f deployment-sit.yml
                            kubectl apply -f service-sit.yml

                            kubectl rollout status deployment/netflix-app-sit
                        '''
                    }
                }
            }
        }

             
         }
    }
}
