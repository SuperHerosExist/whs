# Coach Admin Guide

## Managing Player Profiles

As a coach, you can now fully manage your team's player profiles through the Coach Dashboard.

### Accessing the Coach Dashboard

1. Sign in with a coach account (user role must be set to `coach` in Firestore)
2. Navigate to the Coach Dashboard from the main navigation
3. Click on the "Roster Management" tab

### Editing Player Profiles

In the Roster Management tab, you'll see a table with all active players. For each player, you can:

#### Available Actions:

1. **Edit Player Profile** - Click the pencil icon (Edit2) in the Actions column
2. **Toggle Active Status** - Click on the "Active/Inactive" badge to toggle

#### Editable Fields in the Edit Modal:

- **Full Name** - The player's display name
- **Current Grade** - Select from 9th, 10th, 11th, or 12th grade
- **Graduation Year** - The year the player will graduate
- **Jersey Number** (Optional) - Player's jersey number
- **Bio** (Optional) - Short description about the player (max 500 characters)
- **Active Status** - Toggle whether the player appears on the public roster

#### Read-Only Information:

- **Email** - Cannot be changed from the dashboard (displayed for reference)
- **Player ID** - Firebase document ID (displayed for reference)
- **Statistics** - Average score, high game, and games played are synced from the Stats app and cannot be edited here

### Permission System

**Access Control:**
- Only users with the `coach` role can access the Coach Dashboard
- Non-coach users attempting to access will see an "Access Restricted" message
- The Firestore rules enforce these permissions at the database level

### How to Set a User as Coach

To grant coach permissions to a user:

1. Go to Firebase Console > Firestore Database
2. Navigate to the `users` collection
3. Find the user document (by UID or email)
4. Edit the `role` field to `coach`
5. The user will have coach permissions immediately (may need to sign out/in)

### Firestore Security Rules

The following operations are allowed for coaches:

```javascript
// Coaches can:
- Read all user profiles in their program
- Read all player profiles
- Create new player profiles
- Update ANY player profile (all fields)
- Delete/deactivate players
- Manage teams
- Create/update/delete public content
- Manage schedule events
- Create/update/delete achievements
```

### Managing New Players

**Option 1: Player Self-Registration**
1. Player signs up using the Sign Up form
2. Their profile is automatically created with role `player`
3. Coach can then edit their profile to set grade, jersey number, etc.

**Option 2: Coach Creates Profile**
1. Click "Add Player" button in the Coach Dashboard
2. (Coming soon: This will open a form to create a new player account)

### Best Practices

1. **Keep grades up to date** - Update player grades at the start of each school year
2. **Deactivate graduated players** - Rather than deleting, set them to "Inactive"
3. **Review player bios** - Ensure appropriate content in player bio sections
4. **Jersey numbers** - Keep these updated for accurate roster displays
5. **Stats sync** - Remember that stats come from the Stats app and update automatically

### Troubleshooting

**"Access Restricted" message:**
- Verify your user role is set to `coach` in Firestore `users` collection
- Sign out and sign back in to refresh your authentication state

**Can't save changes:**
- Check browser console for errors
- Verify you have an active internet connection
- Ensure Firestore rules are properly deployed

**Player stats not updating:**
- Stats are synced from the Stats app separately
- Check the Stats app for the latest game entries
- Stats updates may take a few minutes to propagate

### Future Enhancements

Planned features for coach administration:

- [ ] Bulk import players from CSV
- [ ] Email players directly from the dashboard
- [ ] Export roster to PDF
- [ ] Player attendance tracking
- [ ] Practice schedule assignments
- [ ] Team formation and management
- [ ] Season archiving

---

## Related Documentation

- [Deployment Summary](./DEPLOYMENT_SUMMARY.md)
- [Testing Checklist](./TESTING_CHECKLIST.md)
- [Firebase Setup Guide](./FIREBASE_SETUP_GUIDE.md)
