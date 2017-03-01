import CandidateHistory from 'app/collections/candidateHistory'

Meteor.methods({
	'loadCandidateHistory':function(email_id){
		var candidateHistory = CandidateHistory.find({"email_id":email_id}).fetch()
		return candidateHistory
	},

	'candidateComments':function(email_id,comments){
		var candidateHistory = CandidateHistory.find({"email_id":email_id,"comments":comments}).fetch()
		return candidateHistory
	}
})
