import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ScheduleEvent } from '@/types';
import { Calendar, MapPin, Trophy, Users, Clock, Home as HomeIcon } from 'lucide-react';
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { Card, EmptyState, Tabs, Badge } from '@/components/ui';
import type { Tab } from '@/components/ui';

type TabId = 'upcoming' | 'past' | 'all';

export const Schedule: React.FC = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TabId>('upcoming');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, 'schedules');
        const q = query(
          eventsRef,
          where('programId', '==', 'willard-tigers'),
          orderBy('date', 'desc')
        );

        const snapshot = await getDocs(q);
        const eventsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as ScheduleEvent[];

        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const now = new Date();
  const upcomingEvents = events.filter(e => e.date >= now).reverse();
  const pastEvents = events.filter(e => e.date < now);

  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  // Group events by month
  const groupByMonth = (eventsList: ScheduleEvent[]) => {
    const groups: { [key: string]: ScheduleEvent[] } = {};

    eventsList.forEach(event => {
      const monthKey = format(event.date, 'MMMM yyyy');
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(event);
    });

    return groups;
  };

  const filteredEvents = filter === 'upcoming' ? upcomingEvents : filter === 'past' ? pastEvents : [...upcomingEvents, ...pastEvents.reverse()];
  const groupedEvents = groupByMonth(filteredEvents);

  const tabs: Tab[] = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past Events' },
    { id: 'all', label: 'All' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiger-primary-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-tiger-primary-black via-tiger-neutral-900 to-tiger-neutral-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl">
              <Calendar className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black">
                Schedule
              </h1>
              <p className="text-xl opacity-90 mt-2">
                2024-2025 Season
              </p>
            </div>
          </div>
          <p className="text-lg opacity-75 max-w-3xl">
            Stay updated with all team events, matches, and practice sessions
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-20">
        {/* Next Event Countdown */}
        {nextEvent && filter === 'upcoming' && (
          <Card className="mb-8 bg-gradient-to-br from-tiger-tiger-darkRed to-red-800 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-semibold opacity-90">Next Event</span>
                </div>
                <h3 className="text-2xl font-black mb-2">
                  {nextEvent.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm opacity-90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(nextEvent.date, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{nextEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{nextEvent.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-5xl font-black mb-2">
                  {getTimeUntilEvent(nextEvent.date)}
                </div>
                <div className="text-sm font-semibold opacity-90">
                  {getTimeUntilLabel(nextEvent.date)}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs Navigation */}
        <Card className="mb-6">
          <Tabs
            tabs={tabs}
            activeTab={filter}
            onChange={(tabId) => setFilter(tabId as TabId)}
            variant="pills"
          />
        </Card>

        {/* Events List */}
        {Object.keys(groupedEvents).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedEvents).map(([month, monthEvents]) => (
              <div key={month}>
                <h2 className="text-2xl font-black text-tiger-primary-black mb-4">
                  {month}
                </h2>
                <div className="space-y-4">
                  {monthEvents.map((event) => (
                    <EventCard key={event.id} event={event} isPast={event.date < now} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title={filter === 'upcoming' ? 'No upcoming events' : filter === 'past' ? 'No past events' : 'No events found'}
            description={filter === 'upcoming' ? 'Check back later for scheduled events' : filter === 'past' ? 'No events have occurred yet' : 'No events in the schedule'}
          />
        )}
      </div>
    </div>
  );
};

// Helper functions
function getTimeUntilEvent(date: Date): string {
  const now = new Date();
  const days = differenceInDays(date, now);

  if (days > 0) return days.toString();

  const hours = differenceInHours(date, now);
  if (hours > 0) return hours.toString();

  const minutes = differenceInMinutes(date, now);
  return Math.max(0, minutes).toString();
}

function getTimeUntilLabel(date: Date): string {
  const now = new Date();
  const days = differenceInDays(date, now);

  if (days > 1) return 'days away';
  if (days === 1) return 'day away';

  const hours = differenceInHours(date, now);
  if (hours > 1) return 'hours away';
  if (hours === 1) return 'hour away';

  return 'minutes away';
}

interface EventCardProps {
  event: ScheduleEvent;
  isPast?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isPast = false }) => {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'match':
        return 'from-tiger-tiger-darkRed to-red-700';
      case 'tournament':
        return 'from-tiger-tiger-gold to-yellow-600';
      case 'practice':
        return 'from-tiger-neutral-700 to-tiger-neutral-900';
      default:
        return 'from-tiger-neutral-600 to-tiger-neutral-800';
    }
  };

  const getEventTypeBadgeVariant = (type: string): 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold' => {
    switch (type) {
      case 'match':
        return 'error';
      case 'tournament':
        return 'gold';
      case 'practice':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card hover className={`cursor-pointer ${isPast ? 'opacity-75' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Date */}
        <div className={`flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br ${getEventTypeColor(event.type)} flex flex-col items-center justify-center text-white shadow-lg`}>
          <div className="text-3xl font-black">
            {format(event.date, 'd')}
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide">
            {format(event.date, 'MMM')}
          </div>
        </div>

        {/* Event Details */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant={getEventTypeBadgeVariant(event.type)}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
            {event.isHome && (
              <Badge variant="success">
                <HomeIcon className="w-3 h-3 mr-1" />
                Home
              </Badge>
            )}
            {isPast && (
              <Badge variant="default">
                Completed
              </Badge>
            )}
          </div>

          <h3 className="text-xl font-black text-tiger-primary-black mb-3">
            {event.title}
          </h3>

          <div className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2 text-sm text-tiger-neutral-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{event.location}</span>
            </div>
            {event.opponent && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-medium">vs {event.opponent}</span>
              </div>
            )}
          </div>

          {event.description && (
            <p className="mt-3 text-sm text-tiger-neutral-700">
              {event.description}
            </p>
          )}
        </div>

        {/* Result (if past event) */}
        {isPast && event.result && (
          <div className="flex-shrink-0">
            <div className={`px-6 py-4 rounded-xl ${
              event.result.winner === 'home'
                ? 'bg-green-50 border-2 border-green-500'
                : event.result.winner === 'away'
                ? 'bg-red-50 border-2 border-red-500'
                : 'bg-tiger-neutral-100 border-2 border-tiger-neutral-400'
            }`}>
              <div className="flex items-center gap-3">
                <Trophy className={`w-6 h-6 ${
                  event.result.winner === 'home' ? 'text-green-600' : 'text-tiger-neutral-500'
                }`} />
                <div>
                  <div className="font-black text-2xl text-tiger-primary-black">
                    {event.result.homeScore} - {event.result.awayScore}
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-wide ${
                    event.result.winner === 'home' ? 'text-green-700' : event.result.winner === 'away' ? 'text-red-700' : 'text-tiger-neutral-600'
                  }`}>
                    {event.result.winner === 'home' ? 'Victory' : event.result.winner === 'away' ? 'Loss' : 'Tie'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
