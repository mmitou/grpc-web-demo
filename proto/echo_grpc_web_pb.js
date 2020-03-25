/**
 * @fileoverview gRPC-Web generated client stub for proto
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.proto = require('./echo_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.proto.EchoServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.proto.EchoServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.proto.EchoRequest,
 *   !proto.proto.EchoResponse>}
 */
const methodDescriptor_EchoService_Echo = new grpc.web.MethodDescriptor(
  '/proto.EchoService/Echo',
  grpc.web.MethodType.UNARY,
  proto.proto.EchoRequest,
  proto.proto.EchoResponse,
  /**
   * @param {!proto.proto.EchoRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.proto.EchoResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.proto.EchoRequest,
 *   !proto.proto.EchoResponse>}
 */
const methodInfo_EchoService_Echo = new grpc.web.AbstractClientBase.MethodInfo(
  proto.proto.EchoResponse,
  /**
   * @param {!proto.proto.EchoRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.proto.EchoResponse.deserializeBinary
);


/**
 * @param {!proto.proto.EchoRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.proto.EchoResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.proto.EchoResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.proto.EchoServiceClient.prototype.echo =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/proto.EchoService/Echo',
      request,
      metadata || {},
      methodDescriptor_EchoService_Echo,
      callback);
};


/**
 * @param {!proto.proto.EchoRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.proto.EchoResponse>}
 *     A native promise that resolves to the response
 */
proto.proto.EchoServicePromiseClient.prototype.echo =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/proto.EchoService/Echo',
      request,
      metadata || {},
      methodDescriptor_EchoService_Echo);
};


module.exports = proto.proto;

