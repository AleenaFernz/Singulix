-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create venues table
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    organizer_id UUID NOT NULL,
    venue_id UUID REFERENCES venues(id),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    max_attendees INTEGER NOT NULL,
    max_tickets_per_user INTEGER NOT NULL DEFAULT 1,
    age_restriction_min INTEGER,
    age_restriction_max INTEGER,
    gender_restriction VARCHAR(50),
    dietary_restrictions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create time_slots table
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    capacity INTEGER NOT NULL,
    current_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id),
    user_id UUID NOT NULL,
    time_slot_id UUID REFERENCES time_slots(id),
    qr_code TEXT NOT NULL UNIQUE,
    is_valid BOOLEAN DEFAULT true,
    entry_time TIMESTAMP WITH TIME ZONE,
    dietary_restrictions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create team_members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id),
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create crowd_data table
CREATE TABLE crowd_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id),
    venue_id UUID REFERENCES venues(id),
    current_count INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id),
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_venue ON events(venue_id);
CREATE INDEX idx_time_slots_event ON time_slots(event_id);
CREATE INDEX idx_tickets_event ON tickets(event_id);
CREATE INDEX idx_tickets_user ON tickets(user_id);
CREATE INDEX idx_tickets_qr ON tickets(qr_code);
CREATE INDEX idx_team_members_event ON team_members(event_id);
CREATE INDEX idx_crowd_data_event ON crowd_data(event_id);
CREATE INDEX idx_crowd_data_venue ON crowd_data(venue_id);
CREATE INDEX idx_alerts_event ON alerts(event_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_venues_updated_at
    BEFORE UPDATE ON venues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at
    BEFORE UPDATE ON time_slots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowd_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Venues policies
CREATE POLICY "Venues are viewable by everyone"
    ON venues FOR SELECT
    USING (true);

CREATE POLICY "Venues are insertable by authenticated users"
    ON venues FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Events policies
CREATE POLICY "Events are viewable by everyone"
    ON events FOR SELECT
    USING (true);

CREATE POLICY "Events are insertable by authenticated users"
    ON events FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Events are updatable by organizers"
    ON events FOR UPDATE
    USING (organizer_id = auth.uid());

-- Time slots policies
CREATE POLICY "Time slots are viewable by everyone"
    ON time_slots FOR SELECT
    USING (true);

CREATE POLICY "Time slots are insertable by event organizers"
    ON time_slots FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = time_slots.event_id
            AND events.organizer_id = auth.uid()
        )
    );

-- Tickets policies
CREATE POLICY "Tickets are viewable by their owners"
    ON tickets FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Tickets are insertable by authenticated users"
    ON tickets FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Team members policies
CREATE POLICY "Team members are viewable by event organizers"
    ON team_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = team_members.event_id
            AND events.organizer_id = auth.uid()
        )
    );

CREATE POLICY "Team members are insertable by event organizers"
    ON team_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = team_members.event_id
            AND events.organizer_id = auth.uid()
        )
    );

-- Crowd data policies
CREATE POLICY "Crowd data is viewable by event team"
    ON crowd_data FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.event_id = crowd_data.event_id
            AND team_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Crowd data is insertable by event team"
    ON crowd_data FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.event_id = crowd_data.event_id
            AND team_members.user_id = auth.uid()
        )
    );

-- Alerts policies
CREATE POLICY "Alerts are viewable by event team"
    ON alerts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.event_id = alerts.event_id
            AND team_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Alerts are insertable by event team"
    ON alerts FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.event_id = alerts.event_id
            AND team_members.user_id = auth.uid()
        )
    ); 