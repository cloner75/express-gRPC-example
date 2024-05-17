const client = require('../grpc/grpc.client');


class AppController {

  static async get(_req, res) {
    client.getAll(null, (err, data) => {
      if (!err) {
        res.render('customers', {
          results: data.customers
        });
      } else {
        return res.send({
          message: err.message || 'internal server error'
        });
      }
    });
  }

  static async save(req, res) {
    let newCustomer = {
      name: req.body.name,
      age: req.body.age,
      address: req.body.address
    };

    client.insert(newCustomer, (err, data) => {
      console.log('🚀 ~ client.insert ~ err:', err);
      if (err) throw err;
      res.redirect('/');
    });
  }

  static async remove(req, res) {
    client.remove({ id: req.body.customer_id }, (err, _) => {
      if (err) throw err;
      res.redirect('/');
    });
  }

  static async update(req, res) {
    const updateCustomer = {
      id: req.body.id,
      name: req.body.name,
      age: req.body.age,
      address: req.body.address
    };

    client.update(updateCustomer, (err, data) => {
      console.log('🚀 ~ client.update ~ err:', err);
      if (err) throw err;
      res.redirect('/');
    });
  }

}

module.exports = AppController;