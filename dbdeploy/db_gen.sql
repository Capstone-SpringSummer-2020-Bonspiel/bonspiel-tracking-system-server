drop table if exists CurlingEvent, Organization, Pool, Bracket, CurlingTeam, Curler, Draw, Game, EndScore, Email, EventTeams, Admin CASCADE;
drop type if exists valid_event_types, valid_position_types, valid_stone_colors, valid_ice_sheets CASCADE;


/* 
 * CurlingEvent: an event to be tracked by the bonspiel app. 
 * there are 3 types: a pool-based event, a bracket event (typical of bonspiels), 
 * or a 'championship' which is a pool event followed by a playoff bracket. 
 */

create type valid_event_types as enum ('friendly', 'pools', 'brackets', 'championship');
create table CurlingEvent (
	ID Serial PRIMARY KEY, 
	name text,
	begin_date timestamp,
	end_date timestamp,
	completed boolean DEFAULT FALSE, 
	info text, 
	event_type valid_event_types, 
	CHECK (end_date>=begin_date)
);

/* Organization - a club or other organization to which a curler is affiliated */
create table Organization (
	ID Serial PRIMARY KEY,
	short_name text,
	full_name text
);

/*
 * Pool - a group of teams that compete against each other in a 'pools' 
 * or 'championship' type of event. pools generally have a static set 
 * of games determined when the event begins.
 */
create table Pool (
	ID Serial PRIMARY KEY,
	event_id integer NOT NULL REFERENCES CurlingEvent ON DELETE CASCADE,
	name text,
	color text
);

/* 
 * Bracket - a group of teams that compete against each other in a 'brackets' 
 * or 'championship' type of event. Brackets have special rules about teams 
 * advancing to future games.
 */
create table Bracket (
	ID Serial NOT NULL PRIMARY KEY,
	event_id integer NOT NULL REFERENCES CurlingEvent(ID) ON DELETE CASCADE,
	name text
);

/* 
 * CurlingTeam - a team that competes in a a curling event 
 *   note that by including a "pool" field and a "dsc" field we are 
 *   essentially implying that a team exists only for the duration of one event.
 *   iow, if the same team entered multiple events then the team would need to 
 *   be entered as separate teams, one per event. This is fine for v1.0 and 
 *   can be revisited for future versions of the bonspiel tracking system.
 */
create table CurlingTeam (
	ID Serial PRIMARY KEY,
	affiliation integer REFERENCES Organization(ID),
	name text,
	note text
	/* dsc DECIMAL(6,2)  usually only 'championship' type events use this field */
	/* might also want to model photos or other media for the team */
	/* might want to also model contact info such as phone, email address */
	/* might want to also model 'coach' */
);

create table eventteams (
	event_id integer REFERENCES curlingevent(ID) ON DELETE CASCADE,
	team_id integer REFERENCES curlingteam(ID),
	PRIMARY KEY(event_id, team_id)
);


/* Curler - a competitor who plays on a CurlingTeam */
create type valid_position_types as enum ('skip', 'vice', 'second', 'lead', 'fourth', 'alternate');
create table Curler (
	ID serial PRIMARY KEY,
	name text,
	position valid_position_types,
	affiliation integer REFERENCES Organization(ID),
	CurlingTeam_id integer REFERENCES CurlingTeam(ID)
	/* might also want to model a photo for the curler */
);

/* Draw - a collection of curling games that all start at the begin at the same time. */
create table Draw (
	ID serial PRIMARY KEY,
	event_id integer NOT NULL REFERENCES CurlingEvent(ID) ON DELETE CASCADE,
	name text,
	start timestamp,
	video_url text
    /* 
     * game_draw = TRUE just means that the draw contains games. 
     * this is the default case and the most common case.
     * game_draw = FALSE can be used to indicate time slots containing 
     * meetings, banquet, lunch, maintenance periods, practices, ceremony, etc. 
     * i.e., any scheduled activity other than actual curling
     
	game_draw boolean DEFAULT TRUE, */
);

/* Game - a pair of teams competing against each other */
create type valid_stone_colors as enum ('red', 'yellow');
create type valid_ice_sheets as enum ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', '1', '2', '3', '4', '5', '6', '7', '8');
create table Game (
	ID Serial PRIMARY KEY,
	event_type valid_event_types,
	notes text,
	bracket_id integer REFERENCES Bracket(ID) DEFAULT NULL,
	pool_id integer REFERENCES Pool(ID) DEFAULT NULL,
	draw_id integer NOT NULL REFERENCES Draw(ID) ON DELETE CASCADE, 
	CurlingTeam1_id integer REFERENCES CurlingTeam(ID),
	CurlingTeam2_id integer REFERENCES CurlingTeam(ID),
	stone_color1 valid_stone_colors,
	stone_color2 valid_stone_colors,
	winner_dest integer REFERENCES Game(ID),
	loser_dest integer REFERENCES Game(ID),
	ice_sheet valid_ice_sheets,
	finished boolean,
	/*currentEnd integer,*/
	winner integer DEFAULT NULL,
	CHECK (CurlingTeam1_id <> CurlingTeam2_id)
);


/* 
 * EndScore - the result of one 'end' of a curling game. Typically games 
 * comprise 8 ends, but they can have fewer (if the score is lopsided and 
 * the losing team concedes) or more (if the game is defined to be longer 
 * or if an 8-end game is tied and goes to an extra, 9th end).
 */
create table EndScore (
    	ID Serial PRIMARY KEY,
    	game_id integer NOT NULL REFERENCES Game(ID) ON DELETE CASCADE,
	end_number integer,
    	blank boolean,	
    	CurlingTeam1_scored boolean,
	score integer,
	CHECK (end_number>=1),
	CHECK (end_number<=11)
);


create table Email (
	name text,
	email text,
	PRIMARY KEY(name, email)
);

create table Admins (
	username text PRIMARY KEY,
	hash text,
	salt text,
	hashLength integer,
  isSuperAdmin boolean default false
);