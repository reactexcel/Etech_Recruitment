import CandidateHistory from 'app/collections/candidateHistory'

Meteor.methods({
	'loadCandidateHistory':function(email_id){
		var candidateHistory = CandidateHistory.find({"email_id":email_id}).fetch()
		return candidateHistory
	},

	'candidateComments':function(email_id,comments){
		var candidateHistory = CandidateHistory.find({"email_id":email_id,"comments":comments}).fetch()
		return candidateHistory
	},
	"submitComment": (id, comment) => {
			var history = CandidateHistory.find({email_id: id}).fetch();
			try{
				if (history.length !== 0) {
					if(typeof history[0].comments === "undefined"){
						CandidateHistory.update({email_id: id}, {$set: {comments:[{"comment": comment, date:Date()}]}});
					}else{
						CandidateHistory.update({email_id: id}, {$push:{comments: {"comment": comment, date:Date()}}});
					}
				} else {
					CandidateHistory.insert({
							email_id: id,
							comments: [{
								comment: comment,
								date:Date()
							}]
					});
				}
			} catch(e) {
				return 0;
			}
			return 1;
	}
})
