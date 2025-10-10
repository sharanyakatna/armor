#!/bin/bash
set -e
REGION="ap-south-1"
ACCOUNT_ID="653765021347"
CLUSTER="armor"
SERVICE="armor"
REPO="armor-backend"
SSM_PATH="/armor/MONGO_URI"
LOG_GROUP="/ecs/armor"
SNS_TOPIC="armor-alerts"

echo "🔒 Setting up secure parameter store..."
aws ssm put-parameter \
  --name "$SSM_PATH" \
  --type "SecureString" \
  --value "mongodb+srv://user:pass@cluster/armorDB?retryWrites=true&w=majority" \
  --overwrite \
  --region $REGION

echo "🔐 Attaching read policy to ecsTaskExecutionRole..."
cat > ssm-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SSMReadAccess",
      "Effect": "Allow",
      "Action": ["ssm:GetParameter", "ssm:GetParameters"],
      "Resource": "arn:aws:ssm:$REGION:$ACCOUNT_ID:parameter/armor/*"
    }
  ]
}
EOF

aws iam put-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-name ECSReadSecretsPolicy \
  --policy-document file://ssm-policy.json

echo "📊 Creating CloudWatch log group..."
aws logs create-log-group --log-group-name "$LOG_GROUP" --region $REGION || true
aws logs put-retention-policy --log-group-name "$LOG_GROUP" --retention-in-days 30 --region $REGION

echo "📈 Enabling Container Insights..."
aws ecs update-cluster-settings \
  --cluster $CLUSTER \
  --settings name=containerInsights,value=enabled \
  --region $REGION

echo "🔔 Creating SNS topic for alerts..."
aws sns create-topic --name $SNS_TOPIC --region $REGION || true

TOPIC_ARN="arn:aws:sns:$REGION:$ACCOUNT_ID:$SNS_TOPIC"

echo "⚠️ Creating CloudWatch alarms..."
aws cloudwatch put-metric-alarm \
  --alarm-name "armor-high-cpu" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 60 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=ClusterName,Value=$CLUSTER Name=ServiceName,Value=$SERVICE \
  --evaluation-periods 2 \
  --alarm-actions $TOPIC_ARN \
  --region $REGION

aws cloudwatch put-metric-alarm \
  --alarm-name "armor-high-memory" \
  --metric-name MemoryUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 60 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=ClusterName,Value=$CLUSTER Name=ServiceName,Value=$SERVICE \
  --evaluation-periods 2 \
  --alarm-actions $TOPIC_ARN \
  --region $REGION

echo "⚖️ Configuring ECS Auto Scaling..."
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/$CLUSTER/$SERVICE \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 1 \
  --max-capacity 4 \
  --region $REGION

aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/$CLUSTER/$SERVICE \
  --policy-name armor-auto-scale-cpu \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 60.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleInCooldown": 60,
    "ScaleOutCooldown": 60
  }' \
  --region $REGION

echo "🧹 Applying ECR image cleanup policy..."
cat > ecr-lifecycle.json <<EOF
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep last 10 images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": { "type": "expire" }
    }
  ]
}
EOF

aws ecr put-lifecycle-policy \
  --repository-name $REPO \
  --lifecycle-policy-text file://ecr-lifecycle.json \
  --region $REGION

echo "✅ Post-deployment configuration completed successfully!"
echo "Next Steps:"
echo "  1. Subscribe to the SNS alert email."
echo "  2. Confirm ECS shows healthy tasks."
echo "  3. (Optional) Run HTTPS setup for production."

