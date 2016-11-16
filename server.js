'use strict';

const Hapi = require('hapi');
var uuid = require('node-uuid');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

// postgres plugin
const plugin = {
    register: require('hapi-node-postgres'),
    options: {
	connectionString: 'postgres://bbuser:welcome1@localhost:5432/bbplatform',
	native: false
    }
}; 

server.register(plugin, (err) => {
    if (err) {
	console.error('Failed loading "hapi-node-postgres" plugin');
    }
});


// Add the route
server.route({
    method: 'GET',
    path:'/videoservice', 
    handler: function (request, reply) {
	
	var id1 = uuid.v4();
	var id2 = uuid.v4();

	request.pg.client.query('SELECT * FROM "bbuser"."vid"', function (err, result) {
	 //   console.log(err, result);
	    reply(result.rows);
	})
	
//        return reply('Hi world via GET request<br/>' + id1 + '<br/>' + id2);
    }
});

server.route({
    method: 'POST',
    path:'/videoservice', 
    handler: function (request, reply) {

	request.pg.client.query('INSERT INTO vid values ( nextval(\'vid_seq\'), $1, $2)',
					[request.payload.name, request.payload.jsonval], function (err, result) {
					    if (err) throw err;

					    reply (result);
					});
	

    }
});


server.route({
    method: 'PUT',
    path:'/videoservice', 
    handler: function (request, reply) {

	// validation
	if (request.payload.vidid == undefined) {
	    throw new Error('Missing vidid for update request');
	} else if (request.payload.name == undefined) {
	    throw new Error('Missing name for update request');
	} else {
	
	    request.pg.client.query('UPDATE vid set name = $1, jsondata = $2 WHERE vidid = $3',
					[request.payload.name, request.payload.jsonval, request.payload.vidid], function (err, result) {
					    if (err) throw err;

					    reply (result);
					});
	
	}
    }
});


server.route({
    method: 'DELETE',
    path:'/videoservice', 
    handler: function (request, reply) {

	// validation
	if (request.payload.vidid == undefined) {
	    throw new Error('Missing vidid for update request');
	} else {
	
	    request.pg.client.query('DELETE FROM vid WHERE vidid = $1',
					[request.payload.vidid], function (err, result) {
					    if (err) throw err;

					    reply (result);
					});
	
	}
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

	 
