import CandidateHistory from 'app/collections/candidateHistory' 

Meteor.methods({
	/*'getCandidateHistory':function(){
		var history = History.find({}).fetch()
		return{
			history:history
		}
	}*/
	'loadCandidateHistory':function(email_id){
		var candidateHistory = CandidateHistory.find({"email_id":email_id}).fetch()
		return candidateHistory
	}
})