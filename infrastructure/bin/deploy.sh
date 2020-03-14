#!/bin/bash

zip -r build_13032020_2140.zip . -x './.git/*' -x './node_modules/*'
aws s3 cp build_13032020_2140.zip s3://ae-firestarter-demo-staging-deployment-staging/build_13032020_2140.zip
aws deploy create-deployment --application-name ae-firestarter-demo-staging --deployment-group-name deployment_group_staging --revision '{"revisionType":"S3","s3Location":{"bucket":"ae-firestarter-demo-staging-deployment-staging","key": "build_13032020_2140.zip","bundleType":"zip"}}'
