import History from 'app/collections/candidateHistory' 

Meteor.methods({
	'getCandidateHistory':function(){
		var history = History.find({}).fetch()
		return{
			history:history
		}
	}
})