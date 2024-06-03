const express = require("express");
const Activity = require("../models/Activity.js");

exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: { itineraryId: req.params.itineraryId },
    });

    res.json({ activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.createActivity = async (req, res) => {
  try {
    const { day, time, title, location, icon, itineraryId } = req.body;

    if (!day || !time || !title || !location || !icon || !itineraryId) {
      return res.status(400).json({ error: "missing_fields" });
    }

    const activity = await Activity.create({
      day,
      time,
      title,
      location,
      icon,
      itineraryId,
      userId: req.user.id,
    });

    res.status(201).json({ activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const { day, time, title, location, icon } = req.body;
    const { id } = req.params;

    const activity = await Activity.findOne({ where: { id } });

    if (!activity) {
      return res.status(404).json({ error: "activity_not_found" });
    }

    if (activity.userId !== req.user.id) {
      return res.status(403).json({ error: "forbidden" });
    }

    activity.day = day;
    activity.time = time;
    activity.title = title;
    activity.location = location;
    activity.icon = icon;

    await activity.save();

    res.json({ activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findOne({ where: { id } });

    if (!activity) {
      return res.status(404).json({ error: "activity_not_found" });
    }

    if (activity.userId !== req.user.id) {
      return res.status(403).json({ error: "forbidden" });
    }

    await activity.destroy({ force: true });

    res.json({ message: "activity_deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server_error" });
  }
};
