#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

# provided by the CI project settings
image_name="${IMAGE_NAME}"
aws_repository="${AWS_REPOSITORY}"
aws_region="${AWS_REGION}"

container_name="${CONTAINER_NAME}"

# define tagging logic
  # github actions env vars: https://docs.github.com/en/actions/reference/environment-variables#default-environment-variables

if [[ $BRANCH_NAME == master* ]]; then
    image_tag='latest'
else
    image_tag=$(echo "$BRANCH_NAME" | sed -r 's/.+?\/(.+)/\1-latest/')
fi


#### let's do this!

get_secrets(){
  gem install secrets_cli -N
}

build_image(){
  secrets pull -e build -y
  docker build -f ./docker/Dockerfile -t "${aws_repository}/${image_name}:${image_tag}" .
  rm -f ./.env
}

run_tests(){

  docker run --rm --name "${container_name}" -e ./.env:/app/.env -d "${aws_repository}/${image_name}:${image_tag}"
  docker exec "${container_name}" bash -c "npm run test"
	docker stop "${container_name}"
}

push_image(){
  aws ecr get-login-password --region "${aws_region}" | docker -D login --username AWS --password-stdin "${aws_repository}"

  docker push "${aws_repository}/${image_name}:${image_tag}"
}

main() {
  get_secrets
  build_image
  run_tests
  push_image
}

main "$@"
