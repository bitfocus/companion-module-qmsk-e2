var instance_skel = require('../../instance_skel');
var actions       = require('./actions');
var udp           = require('dgram');
var debug;
var log;
var server;

class instance extends instance_skel {

	constructor(system,id,config) {
		super(system,id,config)

		Object.assign(this, {...actions})

		this.actions()
	}

	actions(system) {
		this.setActions(this.getActions());
	}

	config_fields() {

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module converts tally informattion to a button press'
		},
		{
			type: 'textinput',
			id: 'host',
			width: 6,
			label: 'IP Address of the PI',
			regex: this.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			width: 6,
			label: 'Port of the API',
			regex: this.REGEX_PORT,
			default: 8001
		},
		{
			type: 'number',
			id: 'tally1Page',
			width: 6,
			label: 'Page for Tally ID 1',
			min: 1,
			max: 99
		},
		{
			type: 'number',
			id: 'tally1Button',
			width: 6,
			label: 'Button for Tally ID 1',
			min: 1,
			max: 32
		},
	]
	}

	action(action) {
		let id = action.action;
		let cmd;
		let opt = action.options;
	}

	destroy() {
		if (this.timer !== undefined) {
			clearTimeout(this.timer);
		}
		debug("destroy", this.id);
	}

	init() {
		debug = this.debug;
		log = this.log;
		// this.getData();
		this.createListener()
		this.status(this.STATE_OK)
	}

	createListener() {
		// Load socket
		console.log('waiting for connection...')

		server = udp.createSocket('upd4', (socket) => {
			// socket.write('Listener active\r\n');
			socket.on('connection', (socket) => {
				console.log("connection")
				console.log(socket);
			})
			socket.on('end', () => {
				console.log('client ended connection');
			})
			socket.on('data', (data) => {
				console.log('data:', data);
			})
		})

		//listen to port on localhost
		server.listen('3051', '0.0.0.0')
	}

	getData() {
		if(this.config.tally1Page !== undefined && this.config.tally1Button !== undefined && this.config.host !== undefined && this.config.port) {

			let tally1Page = this.config.tally1Page
			let tally1Button = this.config.tally1Button

			try {
				this.timer = setInterval(() => {
					this.system.emit('rest_get', `http://${this.config.host}:${this.config.port}/api/tally`, (err, result) =>  {
						if (err !== null) {
							console.log('error', 'HTTP GET Request failed (' + result.error.code + ')');
							this.status(this.STATUS_ERROR, result.error.code);
						}
						else {
							console.log("data: "+ result.data.Tally[0].Program);
						}
					})
				} , 2000) // Every second
			}
			catch (error) {
					console.log('(timerstuff) Error cause is:', error);
			}
		}
	}

	updateConfig(config) {

		this.config = config

		this.actions()

	}

	init_variables() {

		var variables = [
			{ name: 'dynamic1', label: 'dynamic variable' },
			// { name: 'dynamic2', label: 'dynamic var2' },
		]

		this.setVariableDefinitions(variables)

	}

}

exports = module.exports = instance;
