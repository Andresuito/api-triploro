const Invitation = require("../models/Invitation");
const User = require("../models/User");
const Itinerary = require("../models/Itinerary");

exports.getInvites = async (req, res) => {
  try {
    const { id } = req.user;

    const pendingInvites = await Invitation.findAll({
      where: {
        userId: id,
        status: "pending",
      },
      include: {
        model: Itinerary,
        as: "itinerary",
      },
    });

    res.json(pendingInvites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.getItineraryInvitationsAccepted = async (req, res) => {
  try {
    const { id } = req.user;

    const invitations = await Invitation.findAll({
      where: {
        userId: id,
        status: "accepted",
      },
      include: {
        model: Itinerary,
        as: "itinerary",
      },
    });

    res.json(invitations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.getInvitations = async (req, res) => {
  try {
    const itineraryId = req.params.itineraryId;

    const invitations = await Invitation.findAll({
      where: {
        itineraryId,
        status: ["pending", "accepted"],
      },
      attributes: ["username", "itineraryId"],
    });

    res.json(invitations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.createInvitation = async (req, res) => {
  const { itineraryId, username, invitedBy } = req.body;

  try {
    const itinerary = await Itinerary.findByPk(itineraryId);

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const invitation = await Invitation.create({
      username: user.username,
      invitedBy: invitedBy,
      itineraryId,
      userId: user.id,
    });

    res
      .status(201)
      .json({ message: "Invitation created successfully", invitation });
  } catch (error) {
    console.error("Error creating invitation:", error);
    res.status(500).json({ error: "error_invitation" });
  }
};

exports.acceptInvitation = async (req, res) => {
  const { id } = req.user;
  const { invitationId } = req.body;

  try {
    const invitation = await Invitation.findByPk(invitationId);

    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    if (invitation.userId !== id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await invitation.update({ status: "accepted" });

    res.json({ message: "Invitation accepted successfully" });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ error: "error_accepting_invitation" });
  }
};

exports.rejectInvitation = async (req, res) => {
  const { id } = req.user;
  const { invitationId } = req.body;

  try {
    const invitation = await Invitation.findByPk(invitationId);

    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    if (invitation.userId !== id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await invitation.destroy();

    res.json({ message: "Invitation rejected and deleted successfully" });
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    res.status(500).json({ error: "error_rejecting_invitation" });
  }
};
