#!/usr/bin/env bash

# Tag a docker image for usage in a different environment, e.g. when stg is ready for uat.
# In order to actually use the new image, a deployment process needs to be triggered from the environment.

set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

if [ $# -ne 2 ]; then
   echo "Usage:"
   echo "$0 source-image-tag destination-image-tag [example: $0 latest uat]"
   exit 1
fi

# provided by the CI project settings
image_name="${IMAGE_NAME}"
aws_repository="${AWS_REPOSITORY}"
aws_region="${AWS_REGION}"

src_image_tag=$1
dst_image_tag=$2
git_commit_hash_tag="$(git log -n 1 | head -1 | awk '{print substr($2,1,10)}')"


main(){
  aws ecr get-login-password --region "${aws_region}" | docker -D login --username AWS --password-stdin "${aws_repository}"

  docker pull "${aws_repository}/${image_name}:${src_image_tag}"
  docker tag "${aws_repository}/${image_name}:${src_image_tag}" "${aws_repository}/${image_name}:${dst_image_tag}"
  docker tag "${aws_repository}/${image_name}:${src_image_tag}" "${aws_repository}/${image_name}:${git_commit_hash_tag}"
  docker push "${aws_repository}/${image_name}:${dst_image_tag}"
  docker push "${aws_repository}/${image_name}:${git_commit_hash_tag}"
}

main "$@"