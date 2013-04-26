Product = function (document) {
  _.extend(this, document);
};

Product.prototype = {
  constructor: Product,

  formatPrice: function (format) {
    switch(format) {
      case "cents":
        return this.price;
      default:
        return (this.price / 100).toFixed(2);
    }
  }
};

ProductCollection = new Meteor.Collection("products", {
  transform: function (document) {
    return new Product(document);
  }
});

/************************ Server *********************************************/
if (Meteor.isServer) {
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var seedProducts = function () {
    ProductCollection.remove({});
    for (var i = 0; i < 5; i++) {
      ProductCollection.insert({
        name: "Product " + i,
        // price is in cents
        price: getRandomInt(1000 /* min */, 9999 /* max */),
        description: "Description of the product"
      });
    }
  };
  
  Meteor.startup(seedProducts);

  Meteor.publish("products", function () {
    return ProductCollection.find();
  });
}
/*****************************************************************************/

/************************ Client *********************************************/
if (Meteor.isClient) {
  Meteor.subscribe("products");

  Template.productList.helpers({
    products: function () {
      return ProductCollection.find();
    }
  });
}
/*****************************************************************************/
