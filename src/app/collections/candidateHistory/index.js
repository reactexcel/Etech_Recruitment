import { Mongo } from 'meteor/mongo'

const CandidateHistory = new Mongo.Collection("candidatehistory");
export default CandidateHistory;