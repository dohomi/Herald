Herald.addCourier = function (key, options) {
  check(key, String);
  if (Herald._couriers[key]) 
    throw new Error('Herald: courier "' + key + '"" already exists');

  check(options, Object);
  Herald._couriers[key] = {
    messageFormat: options.message
  };
 var courier = Herald._couriers[key]
  //media is required but should only throw exceptions on the server, where it is needed.
  if (Meteor.isServer) {
    check(options.media, Object);
    var media = _.keys(options.media)
    if (media.length == 0)
      throw new Error('Herald: courier "'+ key + '" must have at least one medium');
    media.forEach(function (medium) {
      if (!_.contains(Herald._media(), medium)) 
        throw new Error('Herald: medium "' + medium + '" is not a known media');

      Herald._runnerCheckers[medium].apply(options.media[medium])
    });
  }
  //define on both
  courier.media = options.media

  courier.transform = options.transform;

  //white-listed params from extension packages
  _.extend(courier, _.pick(options, Herald._extentionParams)) 
}
