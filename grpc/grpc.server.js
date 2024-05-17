require('dotenv').config();
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const { v4: uuidv4 } = require("uuid");
const path = require('path');

const customers = require('./../database/customers.json');

const packageDefinition = protoLoader.loadSync(path.join(__dirname, './proto/customers.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true
});

const customersProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();



server.addService(customersProto.CustomerService.service, {
  getAll: (_, callback) => {
    callback(null, { customers });
  },

  get: (call, callback) => {
    let customer = customers.find(n => n.id == call.request.id);

    if (customer) {
      callback(null, customer);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found"
      });
    }
  },

  insert: (call, callback) => {
    let customer = call.request;

    customer.id = uuidv4();
    customers.push(customer);
    callback(null, customer);
  },

  update: (call, callback) => {
    let existingCustomer = customers.find(n => n.id == call.request.id);

    if (existingCustomer) {
      existingCustomer.name = call.request.name;
      existingCustomer.age = call.request.age;
      existingCustomer.address = call.request.address;
      callback(null, existingCustomer);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found"
      });
    }
  },

  remove: (call, callback) => {
    let existingCustomerIndex = customers.findIndex(
      n => n.id == call.request.id
    );

    if (existingCustomerIndex != -1) {
      customers.splice(existingCustomerIndex, 1);
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found"
      });
    }
  }
});

const SERVER_ADDRESS = `${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`;
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
console.log("🚀 ~ SERVER_ADDRESS:", SERVER_ADDRESS);
server.start();
