var azure = require('azure');
var azureStorage = require('azure-storage');
var request = require('request');
var Repeat = require('repeat');


if(process.env.AZURE_QUEUE_PROVIDER.endsWith("storage")){
  //Initializing Azure Storage Connection
  var queueSvc = azureStorage.createQueueService();
  
  /*
    The getMessagesAndRoute function has to dequeue messages from an Azure Storage Queue and redirect them to the OpenFaaS gateway
  */
  function getMessagesAndRoute() {
    queueSvc.getMessages(process.env.AZURE_QUEUE_NAME, function(error, result, response){
      if(!error){
        var messages = result[0];
        if(messages!=undefined){
          try {
            var message = JSON.parse(messages.messageText);
            //Gateway on a k8s Cluster is usually reachable on port 8080. Modify the first part of functionUrl if needed
            var functionUrl = "http://gateway:8080/function/" + message.functionName;
            
            request.post({
                url: functionUrl,
                body: message.body
            }, function(error,response,body){
              if (!error && response.statusCode == 200) {
                  //Logging for "educational purpose"
                  console.log(body)
              }
            });
            //After the message has been dequeued, just erase it
            queueSvc.deleteMessage(process.env.AZURE_QUEUE_NAME, messages.messageId, messages.popReceipt, function(error, response){
              if(!error){
                //Should implement here
              }
            });
          } catch (error) {
            //Implement catch here
          }
        }
      }
    });
  }
  //Repeat the message dequeue every second
  Repeat(getMessagesAndRoute).every(1000,'ms').start();
}else if(process.env.AZURE_QUEUE_PROVIDER.endsWith("servicebus")){
  //Initializing Azure Service Bus Connection
  var serviceBusService = azure.createServiceBusService();
  
  /*
    The getMessagesAndRoute function has to dequeue messages from an Azure Service Bus Queue and redirect them to the OpenFaaS gateway
  */
  function getMessagesAndRoute() {

    serviceBusService.receiveQueueMessage(process.env.AZURE_QUEUE_NAME, function(error, receivedMessage){
      if(!error){
        try {
          var message = JSON.parse(receivedMessage.body);
           //Gateway on a k8s Cluster is usually reachable on port 8080. Modify the first part of functionUrl if needed
          var functionUrl = "http://gateway:8080/function/" + message.functionName;
          
          request.post({
              url: functionUrl,
              body: message.body
          }, function(error,response,body){
            if (!error && response.statusCode == 200) {
                //Logging for "educational purpose"
                console.log(body)
            }
          });
        } catch (error) {
          //Implement catch here
        }
      }
    });
  }
  //Repeat the message dequeue every second
  Repeat(getMessagesAndRoute).every(1000,'ms').start();
} 