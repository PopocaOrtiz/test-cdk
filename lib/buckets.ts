import {Construct} from 'constructs'
import {BlockPublicAccess, Bucket} from 'aws-cdk-lib/aws-s3'
import {RemovalPolicy} from 'aws-cdk-lib'

export interface BucketsProps {

}

export class Buckets extends Construct {
    constructor(scope: Construct, id: string, props?: BucketsProps) {
        super(scope, id);

        new Bucket(
            this,
            'ImagesS3Bucket', // is not the actual bucket name
            {
                bucketName: 'cdkworkshop-images-bucket',
                blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
                removalPolicy: RemovalPolicy.DESTROY // buckets are not automatically deleted
            }
        )
    }
}