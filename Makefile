.PHONY: deps clean build
deps:
	go get github.com/aws/aws-lambda-go/events
	go get github.com/aws/aws-lambda-go/lambda
	go get github.com/open-policy-agent/opa/loader
	go get github.com/open-policy-agent/opa/rego
	go get github.com/open-policy-agent/opa/ast
	go get github.com/open-policy-agent/opa/storage
clean: 
	rm -rf ./opaCustomGoAuthorizer/main
opabuild:
	GOOS=linux GOARCH=amd64 go build -o opaCustomGoAuthorizer/main ./opaCustomGoAuthorizer