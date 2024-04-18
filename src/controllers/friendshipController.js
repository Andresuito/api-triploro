const Friendship = require("../models/Friendship");
const User = require("../models/User");
const { Op } = require("sequelize");

exports.searchUsersByUsername = async (req, res) => {
  try {
    const { username } = req.query;
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
          username: friend.username,
          createdAt: friendship.createdAt,
        };
      })
    );

    res.json({ friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.isFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const friendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          { userId, friendId: id },
          { userId: id, friendId: userId },
        ],
        status: "accepted",
      },
    });

    res.json({ isFriend: !!friendship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.sendFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
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
