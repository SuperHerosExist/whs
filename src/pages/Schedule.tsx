import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ScheduleEvent } from '@/types';
import { Calendar, MapPin, Trophy, Users } from 'lucide-react';
import { format } from 'date-fns';

export const Schedule: React.FC = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

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
  const filteredEvents = events.filter(event => {
    if (filter === 'upcoming') return event.date >= now;
    if (filter === 'past') return event.date < now;
    return true;
  });

  const upcomingEvents = filteredEvents.filter(e => e.date >= now).reverse();
  const pastEvents = filteredEvents.filter(e => e.date < now);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiger-primary-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-white">
      {/* Page Header */}
      <section className="bg-tiger-primary-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
            Schedule
          </h1>
          <p className="text-xl text-tiger-neutral-300">
            2024-2025 Season
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past Events' },
            { value: 'all', label: 'All' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === tab.value
                  ? 'bg-tiger-primary-black text-white shadow-tiger'
                  : 'bg-white text-tiger-neutral-700 hover:bg-tiger-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Events List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filter === 'all' || filter === 'upcoming' ? (
          <div className="mb-12">
            <h2 className="text-2xl font-display font-black text-tiger-primary-black mb-6">
              Upcoming Events
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-tiger">
                <Calendar className="w-12 h-12 text-tiger-neutral-400 mx-auto mb-4" />
                <p className="text-tiger-neutral-600">No upcoming events scheduled</p>
              </div>
            )}
          </div>
        ) : null}

        {filter === 'all' || filter === 'past' ? (
          <div>
            <h2 className="text-2xl font-display font-black text-tiger-primary-black mb-6">
              Past Events
            </h2>
            {pastEvents.length > 0 ? (
              <div className="space-y-4">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} isPast />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-tiger">
                <Calendar className="w-12 h-12 text-tiger-neutral-400 mx-auto mb-4" />
                <p className="text-tiger-neutral-600">No past events to display</p>
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
};

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

  return (
    <div className={`bg-white rounded-xl shadow-tiger p-6 hover:shadow-tiger-lg transition-all ${isPast ? 'opacity-75' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Date */}
        <div className={`flex-shrink-0 w-20 h-20 rounded-lg bg-gradient-to-br ${getEventTypeColor(event.type)} flex flex-col items-center justify-center text-white`}>
          <div className="text-2xl font-display font-black">
            {format(event.date, 'd')}
          </div>
          <div className="text-xs font-semibold uppercase">
            {format(event.date, 'MMM')}
          </div>
        </div>

        {/* Event Details */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              event.type === 'tournament'
                ? 'bg-tiger-tiger-gold text-tiger-primary-black'
                : event.type === 'match'
                ? 'bg-tiger-tiger-darkRed text-white'
                : 'bg-tiger-neutral-200 text-tiger-neutral-800'
            }`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
            {event.isHome && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                Home
              </span>
            )}
          </div>

          <h3 className="text-xl font-display font-bold text-tiger-primary-black mb-2">
            {event.title}
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 text-sm text-tiger-neutral-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            {event.opponent && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>vs {event.opponent}</span>
              </div>
            )}
          </div>

          {event.description && (
            <p className="mt-3 text-tiger-neutral-700">
              {event.description}
            </p>
          )}
        </div>

        {/* Result (if past event) */}
        {isPast && event.result && (
          <div className="flex-shrink-0 text-center">
            <div className={`px-6 py-3 rounded-lg ${
              event.result.winner === 'home'
                ? 'bg-green-50 border-2 border-green-500'
                : event.result.winner === 'away'
                ? 'bg-red-50 border-2 border-red-500'
                : 'bg-tiger-neutral-100 border-2 border-tiger-neutral-400'
            }`}>
              <div className="flex items-center gap-3">
                <Trophy className={`w-5 h-5 ${
                  event.result.winner === 'home' ? 'text-green-600' : 'text-tiger-neutral-500'
                }`} />
                <div>
                  <div className="font-bold text-lg">
                    {event.result.homeScore} - {event.result.awayScore}
                  </div>
                  <div className="text-xs font-semibold text-tiger-neutral-600">
                    {event.result.winner === 'home' ? 'Win' : event.result.winner === 'away' ? 'Loss' : 'Tie'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
