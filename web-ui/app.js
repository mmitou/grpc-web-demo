const {EchoRequest, EchoResponse} = require('./echo_pb.js');
const {EchoServiceClient} = require('./echo_grpc_web_pb.js');

const echoService = new EchoServiceClient('http://' + window.location.host);
const request = new EchoRequest();
request.setMessage('hello');

echoService.echo(request, {}, function(err, response) {
	if (err != null) {
		alert(err.name, err.message);
	} else {
		alert(response.getMessage());
	}
});
