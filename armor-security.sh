#!/bin/bash
set -e
REGION="ap-south-1"
ALB_NAME="armor-alb"
TARGET_GROUP="armor-target"
DOMAIN="api.yourdomain.com"

echo "🌐 Requesting ACM certificate for $DOMAIN..."
aws acm request-certificate \
  --domain-name "$DOMAIN" \
  --validation-method DNS \
  --region $REGION

echo "📝 Please go to your domain DNS and add the CNAME record shown by ACM for validation."
echo "After it’s validated, press ENTER to continue."
read

CERT_ARN=$(aws acm list-certificates --region $REGION --query "CertificateSummaryList[?DomainName=='$DOMAIN'].CertificateArn" --output text)
ALB_ARN=$(aws elbv2 describe-load-balancers --names $ALB_NAME --region $REGION --query "LoadBalancers[0].LoadBalancerArn" --output text)
TG_ARN=$(aws elbv2 describe-target-groups --names $TARGET_GROUP --region $REGION --query "TargetGroups[0].TargetGroupArn" --output text)

echo "🔒 Creating HTTPS listener on port 443..."
aws elbv2 create-listener \
  --load-balancer-arn "$ALB_ARN" \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=$CERT_ARN \
  --default-actions Type=forward,TargetGroupArn=$TG_ARN \
  --region $REGION

echo "↪️ Redirecting HTTP to HTTPS..."
LISTENER80=$(aws elbv2 describe-listeners --load-balancer-arn "$ALB_ARN" --region $REGION --query "Listeners[?Port==\`80\`].ListenerArn" --output text)

aws elbv2 modify-listener \
  --listener-arn "$LISTENER80" \
  --default-actions Type=redirect,RedirectConfig='{"Protocol":"HTTPS","Port":"443","StatusCode":"HTTP_301"}' \
  --region $REGION

echo "🧱 Creating WAF web ACL..."
aws wafv2 create-web-acl \
  --name armor-waf \
  --scope REGIONAL \
  --default-action Allow={} \
  --region $REGION \
  --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=armor-waf \
  --rules '[
    {
      "Name": "AWSCommonRules",
      "Priority": 1,
      "Statement": { "ManagedRuleGroupStatement": { "VendorName": "AWS", "Name": "AWSManagedRulesCommonRuleSet" } },
      "OverrideAction": { "None": {} },
      "VisibilityConfig": { "SampledRequestsEnabled": true, "CloudWatchMetricsEnabled": true, "MetricName": "AWSCommonRules" }
    }
  ]'

WEBACL_ARN=$(aws wafv2 list-web-acls --scope REGIONAL --region $REGION --query "WebACLs[?Name=='armor-waf'].ARN" --output text)

echo "🔗 Associating WAF with Load Balancer..."
aws wafv2 associate-web-acl \
  --web-acl-arn "$WEBACL_ARN" \
  --resource-arn "$ALB_ARN" \
  --region $REGION

echo "✅ HTTPS and WAF security configuration completed successfully!"
echo "🔗 Access your API securely via: https://$DOMAIN"

