require('dotenv').config();
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const { join } = require('path');
const packageDefinition = protoLoader.loadSync(join(__dirname, './proto/customers.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true
});

const CustomerService = grpc.loadPackageDefinition(packageDefinition).CustomerService;
const client = new CustomerService(
  `${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`,
  grpc.credentials.createInsecure()
);

module.exports = client;