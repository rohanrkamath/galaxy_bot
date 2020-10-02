const mongoose = require("mongoose");

module.exports = {
  init: () => {
    mongoose.connect("add the mongo_uri here", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
    });
    mongoose.set("useFindAndModify", false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connection successfully opened!");
    });

    mongoose.connection.on("err", (err) => {
      console.error(`Mongoose connection error: \n ${err.stack}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose connection disconnected");
    });
  },
};
