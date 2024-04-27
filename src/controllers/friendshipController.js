const Friendship = require("../models/Friendship");
const User = require("../models/User");
const { Op } = require("sequelize");

exports.searchUsersByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const userId = req.user.id;

    const user = await User.findOne({
      where: {
        username: {
          [Op.eq]: username,
        },
      },
      attributes: ["id", "username"],
    });

    if (!user) {
      return res.status(404).json({ error: "user_not_found" });
    }

    if (user.id === userId) {
      return res.status(400).json({ error: "cannot_search_self" });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    const friendships = await Friendship.findAll({
      where: {
        [Op.or]: [{ userId: userId }, { friendId: userId }],
        status: "accepted",
      },
    });

    const friends = await Promise.all(
      friendships.map(async (friendship) => {
        const friendId =
          friendship.userId === userId
            ? friendship.friendId
            : friendship.userId;

        const friend = await User.findByPk(friendId);

        return {
          id: friend.id,
          username: friend.username,
          createdAt: friendship.createdAt,
        };
      })
    );

    const pendingRequests = await Friendship.findAll({
      where: {
        friendId: userId,
        status: "pending",
      },
    });

    res.json({ friends, pendingRequests: pendingRequests.length > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.isFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const friendshipInfo = await Friendship.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { userId, friendId: id },
              { status: ["pending", "accepted"] },
            ],
          },
          {
            [Op.and]: [
              { userId: id, friendId: userId },
              { status: ["pending", "accepted"] },
            ],
          },
        ],
      },
    });

    const isFriend = friendshipInfo && friendshipInfo.status === "accepted";

    const pendingRequest =
      friendshipInfo && friendshipInfo.status === "pending";

    res.json({ isFriend, pendingRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.sendFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.id;

    if (userId === friendId) {
      return res.status(400).json({ error: "cannot_send_request_to_self" });
    }

    const existingRequest = await Friendship.findOne({
      where: {
        userId,
        friendId,
        status: "pending",
      },
    });

    if (existingRequest) {
      return res.status(400).json({ error: "friend_request_already_pending" });
    }

    const friendship = await Friendship.create({
      userId,
      friendId,
      status: "pending",
    });

    res.status(201).json({ success: true, friendship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const pendingRequests = await Friendship.findAll({
      where: {
        friendId: userId,
        status: "pending",
      },
    });

    const requests = await Promise.all(
      pendingRequests.map(async (request) => {
        const user = await User.findByPk(request.userId);
        return {
          id: user.id,
          username: user.username,
          createdAt: request.createdAt,
        };
      })
    );

    res.json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.id;

    const friendship = await Friendship.findOne({
      where: {
        userId: friendId,
        friendId: userId,
        status: "pending",
      },
    });

    if (!friendship) {
      return res.status(400).json({ error: "friend_request_not_found" });
    }

    friendship.status = "accepted";
    await friendship.save();

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.id;
    console.log(userId, friendId);

    const friendship = await Friendship.findOne({
      where: {
        userId: friendId,
        friendId: userId,
        status: "pending",
      },
    });

    if (!friendship) {
      return res.status(400).json({ error: "friend_request_not_found" });
    }

    friendship.status = "rejected";
    await friendship.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.deleteFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.id;

    const friendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
        status: "accepted",
      },
    });

    if (!friendship) {
      return res.status(400).json({ error: "friendship_not_found" });
    }

    await friendship.destroy();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};
