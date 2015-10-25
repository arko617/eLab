/**
 * For google plus 
 */
exports.getUserProfile=function(client, authClient, userId, callback) {
  client
    .plus.people.get({ userId: userId })
    .withAuthClient(authClient)
    .execute(callback);
}