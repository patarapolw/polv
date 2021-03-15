# You will also need
# - gcloud auth login
# - gcloud auth configure-docker

export IMAGE='gcr.io/polvcode/polv'

docker build -t $IMAGE .
docker push $IMAGE
