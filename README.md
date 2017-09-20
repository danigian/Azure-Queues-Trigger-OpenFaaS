# Azure Storage and Azure Service Bus Queues Trigger for OpenFaaS on Kubernetes

## Introduction ##

In this GitHub repository you will find a simple Node.js implementation of an Azure Storage Queue and Azure Service Bus Queue Trigger for OpenFaaS on a Kubernetes cluster.

As you know, one of the OpenFaaS components is the [Function Watchdog](https://github.com/alexellis/faas), an entrypoint which only allows the HTTP requests to be forwarded to the target function via STDIN. The aim of this project is the extension of the Function Watchdog via a very simple Node.js application which dequeues Azure Storage or Azure Service Bus queues and forwards them to the Function Watchdog itself.

## Get started ##

As already stated, the main goal of the project is forwarding , every second, the queue messages to the Function Watchdog.

The messages have to be in the following simple JSON format:

    {
		"functionName": "function-name-as-in-OpenFaaS",
		"body": "body-of-the-message"
	}

In order to deploy the application, you may choose between one of the two following ways:

- **The fast one**: deploy the already built image to your Kubernetes cluster
- **The DIY one**: eventually modify the application code, build a new Docker image and deploy it to your Kubernetes Cluster

### Deploying the fast way ###

In order to deploy with this solution, you **must**:

- Have a standard OpenFaaS deployment (with the gateway internally exposed on the 8080 port - see in the *Useful links* section how to get that)
- Have an already existing *Azure Storage Account* or *Azure Service Bus* with an existing queue (You can find more documentation on that in the *Useful links* section)
- Have *kubectl* already up and running

Are you ready? Let's start our three steps deploy!

1. Download the *queuetriggeropenfaas.yml* file from this repository
2. Open it with your favorite editor and fill up the information on the needed the environment variables
3. Open your command line and just do: *kubectl create -f queuetriggeropenfaas.yml*

**WARNING**: The fast way is fast but **not so secure!** You should use this only for test and development.
It is not suggested writing the connection strings directly in the .yml file. I suggest you to use [Kuberenetes Secrets ](https://kubernetes.io/docs/concepts/configuration/secret) instead.

## Useful links ##

[Gist on how to deploy a Kubernetes Cluster using Azure Container Service with OpenFaaS on it](https://gist.github.com/danigian/e6097fad36f03c476a69e6c44fde074f) 

[Create an Azure Storage Account](https://docs.microsoft.com/en-us/azure/storage/common/storage-create-storage-account)

[How to use Azure Storage Queues with Node.js](https://docs.microsoft.com/en-us/azure/storage/queues/storage-nodejs-how-to-use-queues)

[Create a Service Bus namespace in Azure](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-create-namespace-portal)

[How to use Service Bus Queues with Node.js](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-nodejs-how-to-use-queues)

[Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)

[Azure Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/releases)

## Disclaimer ##

You have the permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.
The software is provided "as is" and the author disclaims all warranties with regard to this software including all implied warranties of merchantability and fitness. in no event shall the author be liable for any special, direct, indirect, or consequential damages or any damages whatsoever resulting from loss of use, data or profits, whether in an action of contract, negligence or other tortious action, arising out of or in connection with the use or performance of this software.