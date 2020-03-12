exports.getActions  = function() {

	var actions = {}

	actions['pressButton'] = {
		label: 'Press button on page',
		options: [{
			label: 'Tally ID',
			type: 'number',
			id: 'id',
			min: 1,
			default: 1
		},
		{
			label: 'Page',
			type: 'number',
			id: 'page',
			min: 1,
			default: 1
		},
		{
			label: 'Bank/Button',
			type: 'number',
			id: 'button',
			min: 1,
			default: 1
		}]
	}

	return actions
}
