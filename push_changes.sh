docker buildx build -f DockerFile.frontend --platform linux/amd64 \
  -t abhishek1231/crammaster-frontend:latest \
  --cache-from=type=registry,ref=abhishek1231/crammaster-frontend:latest \
  --cache-to=type=inline \
  --push .

docker buildx build -f DockerFile.backend --platform linux/amd64 \
  -t abhishek1231/crammaster-backend:latest \
  --cache-from=type=registry,ref=abhishek1231/crammaster-backend:latest \
  --cache-to=type=inline \
  --push .

kubectl rollout restart deployment backend

kubectl rollout restart deployment frontend