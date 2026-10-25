import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name company designation avatar')
      .populate('attendees', 'name email avatar department')
      .sort({ date: 1 });

    res.json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
};

// @desc    Create event (Alumni or Admin)
// @route   POST /api/events
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, meetingUrl, speaker, category } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location: location || 'Online - Google Meet',
      meetingUrl: meetingUrl || '',
      speaker: speaker || {
        name: req.user.name,
        role: req.user.designation || 'Alumnus',
        company: req.user.company || 'Industry Leader'
      },
      category: category || 'Webinar',
      organizer: req.user._id
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create event' });
  }
};

// @desc    RSVP to an event
// @route   PUT /api/events/:id/rsvp
export const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const userIdStr = req.user._id.toString();
    const index = event.attendees.findIndex((att) => att.toString() === userIdStr);

    let isAttending = false;
    if (index !== -1) {
      event.attendees.splice(index, 1);
    } else {
      event.attendees.push(req.user._id);
      isAttending = true;
    }

    await event.save();
    res.json({ success: true, isAttending, attendeeCount: event.attendees.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update RSVP' });
  }
};
