module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '0.0.0.0',
      username: 'root',
      // pem: './path/to/pem'
      password: '123456'
      // or neither for authenticate from ssh-agent
    }
  },

  meteor: {
    // TODO: change app name and path
    name: 'meteorApp',
    path: '../.',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'http://0.0.0.0',
      MONGO_URL: 'mongodb://localhost/meteorApp',
    },

    // ssl: { // (optional)
    //   // Enables let's encrypt (optional)
    //   autogenerate: {
    //     email: 'email.address@domain.com',
    //     // comma seperated list of domains
    //     domains: 'website.com,www.website.com'
    //   }
    // },

    docker: {
      // change to 'kadirahq/meteord' if your app is not using Meteor 1.4
      image: 'abernix/meteord:node-8.11.2-base',
      // image: 'abernix/meteord:base',
      // imagePort: 90
      // imagePort: 80, // (default: 80, some images EXPOSE different ports)
    },

    // This is the maximum time in seconds it will wait
    // for your app to start
    // Add 30 seconds if the server has 512mb of ram
    // And 30 more if you have binary npm dependencies.
    deployCheckWaitTime: 60,

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    port: 27017,
    version: '4.0.4',
    servers: {
      one: {}
    }
  }
};
