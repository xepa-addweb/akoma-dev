const { Autohook } = require('twitter-autohook');

(async start => {
  try {
    const oauth_token = '1281552432514859008-kEz3AQd9J1GH9R8qju99YG42RwuGcm'
    const oauth_token_secret = 'kdXIW35gxYf7si2FDd9RissqnQ0TwfAYIBMqp2f5ycwGa'
    const webhook = new Autohook({
        token: '1281552432514859008-kEz3AQd9J1GH9R8qju99YG42RwuGcm',
        token_secret: 'kdXIW35gxYf7si2FDd9RissqnQ0TwfAYIBMqp2f5ycwGa',
        consumer_key: 'F8xqPxo7D4A5Og4EeJyQKkY9m',
        consumer_secret: '1bSUgNNOXpsZl2EdbJcAsoaL5E15Tsje66XqgySCxHWIrpNQYs',
        env: 'develop'
    });
    
    // Removes existing webhooks
    // await webhook.removeWebhooks();
    
    // Starts a server and adds a new webhook
    await webhook.start();
    
    // Subscribes to your own user's activity
    await webhook.subscribe(oauth_token, oauth_token_secret);  
  } catch (e) {
    // Display the error and quit
    console.error(e);
    process.exit(1);
  }
})();  