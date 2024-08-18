import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

export interface HitCounterProps {
    downstream: IFunction
    readCapacity?: number;
}

export class HitCounter extends Construct {

    public readonly handler: Function;

    public readonly table: Table;

    constructor(scope: Construct, id: string, props: HitCounterProps) {

        if (props.readCapacity !== undefined && (props.readCapacity < 5 || props.readCapacity > 20)) {
            throw new Error("readCapacity must be greater than 5 and less than 20")
        }
        super(scope, id);

        this.table = new Table(this, "Hits", {
            partitionKey: { name: "path", type: AttributeType.STRING },
            encryption: TableEncryption.AWS_MANAGED,
            readCapacity: props.readCapacity ?? 5,
            removalPolicy: RemovalPolicy.DESTROY
        })

        this.handler = new Function(this, "HitCounterHandler", {
            runtime: Runtime.NODEJS_18_X,
            handler: "hitcounter.handler",
            code: Code.fromAsset("lambda"),
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: this.table.tableName
            }
        })

        this.table.grantReadWriteData(this.handler)

        props.downstream.grantInvoke(this.handler)
    }
}