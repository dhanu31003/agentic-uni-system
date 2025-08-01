// api-gateway/controllers/calendarController.js

const CalendarEvent = require('../models/CalendarEvent');

// GET /api/calendar/events
module.exports.getEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('Calendar load error:', err);
    res.status(500).json({ message: 'Failed to load events' });
  }
};

// POST /api/calendar/event
module.exports.createEvent = async (req, res) => {
  try {
    const { date, title, eventType, description } = req.body;
    const ev = await CalendarEvent.create({ date, title, eventType, description });
    res.status(201).json(ev);
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

// PUT /api/calendar/event/:id
module.exports.updateEvent = async (req, res) => {
  try {
    const ev = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json(ev);
  } catch (err) {
    console.error('Update event error:', err);
    res.status(500).json({ message: 'Failed to update event' });
  }
};

// DELETE /api/calendar/event/:id
module.exports.deleteEvent = async (req, res) => {
  try {
    const ev = await CalendarEvent.findByIdAndDelete(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Deleted event' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ message: 'Failed to delete event' });
  }
};
