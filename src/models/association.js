module.exports = function (
  User,
  Invitation,
  Itinerary,
  FavoriteItinerary,
  PersonalItinerary
) {
  User.hasMany(Invitation, { foreignKey: "userId", as: "invitations" });
  Invitation.belongsTo(User, { foreignKey: "userId", as: "inviter" });

  Itinerary.hasMany(Invitation, {
    foreignKey: "itineraryId",
    as: "invitations",
  });
  Invitation.belongsTo(Itinerary, {
    foreignKey: "itineraryId",
    as: "itinerary",
  });

  Itinerary.hasMany(FavoriteItinerary, {
    foreignKey: "code",
    sourceKey: "code",
    as: "favoriteItineraries",
  });
  FavoriteItinerary.belongsTo(Itinerary, {
    foreignKey: "code",
    targetKey: "code",
    as: "itinerary",
  });

  Itinerary.hasMany(PersonalItinerary, {
    foreignKey: "itineraryId",
    as: "personalItineraries",
  });
  PersonalItinerary.belongsTo(Itinerary, { foreignKey: "itineraryId" });

  User.belongsToMany(User, {
    as: "friends",
    through: "Friendship",
    foreignKey: "userId",
    otherKey: "friendId",
  });

  User.hasMany(FavoriteItinerary, { foreignKey: "userId" });
  User.hasMany(PersonalItinerary, { foreignKey: "userId" });
};
