var Slack = require('slack-node')

module.exports = function catchMyException(webhookUri, opts) {
   opts = opts || { };
   opts.quitOnException = opts.hasOwnProperty('quitOnException') ? opts.quitOnException : 1

   var slack = new Slack()
   slack.setWebhook(webhookUri)

   process.on("uncaughtException", function(err) {
     console.log(err);
     console.trace();

     slack.webhook({ 
           channel: opts.slackChannel || "#bugs", 
           username: opts.slackUsername || "webhookbot", 
           text: (err.message || err)+" "+err.stack 
      },function(err,resp){  
       if (err) console.error(err)
       if (opts.quitOnException) process.exit()
     })
}
