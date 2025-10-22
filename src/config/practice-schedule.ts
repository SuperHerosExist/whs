/**
 * Practice Schedule Configuration
 *
 * This file contains the practice schedule information that appears on the homepage.
 * Coaches can update this configuration as needed.
 */

export const practiceSchedule = {
  // Practice days and time
  days: ['Monday', 'Wednesday'],
  time: '3:30 PM',

  // Additional info
  skillLevels: 'All skill levels welcome',
  equipment: 'Equipment provided',
  experience: 'No experience needed',

  // Location (optional)
  location: 'Willard Lanes',

  // Display format for homepage
  getScheduleText(): string {
    const daysText = this.days.join(' & ');
    return `Practice starts every ${daysText} at ${this.time}`;
  },

  getDetailsText(): string {
    return `${this.skillLevels} • ${this.equipment} • ${this.experience}`;
  }
};

// TODO: Move this to coach dashboard configuration in Firebase
// This allows coaches to update practice schedule without code changes
