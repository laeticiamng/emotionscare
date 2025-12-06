const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null;

export type MoodPlaylistEnergyFocus =
  | "breathing"
  | "flow"
  | "release"
  | "recovery"
  | "uplift"
  | "reset";

export interface MoodPlaylistTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  mood: string;
  energy: number;
  focus: MoodPlaylistEnergyFocus;
  instrumentation: string[];
  tags: string[];
  description: string;
}

export interface MoodPlaylistEnergySegment {
  trackId: string;
  start: number;
  end: number;
  energy: number;
  focus: MoodPlaylistEnergyFocus;
}

export interface MoodPlaylistEnergyProfile {
  baseline: number;
  requested: number | null;
  recommended: number;
  alignment: number;
  curve: MoodPlaylistEnergySegment[];
}

export interface MoodPlaylistGuidance {
  focus: string;
  breathwork: string;
  activities: string[];
}

export interface MoodPlaylistMetadata {
  curatedBy: string;
  tags: string[];
  datasetVersion: string;
}

export interface MoodPlaylistResult {
  playlistId: string;
  mood: string;
  requestedMood: string;
  title: string;
  description: string;
  totalDuration: number;
  unit: "seconds";
  tracks: MoodPlaylistTrack[];
  energyProfile: MoodPlaylistEnergyProfile;
  recommendations: string[];
  guidance: MoodPlaylistGuidance;
  metadata: MoodPlaylistMetadata;
}

export type MoodPlaylistEnergyPreference = "low" | "medium" | "high";

export interface MoodPlaylistPreferences {
  energy?: MoodPlaylistEnergyPreference;
  includeInstrumental?: boolean;
  includeVocals?: boolean;
  instrumentation?: string[];
}

export type MoodPlaylistActivity =
  | "relaxation"
  | "focus"
  | "commute"
  | "sleep"
  | "recovery"
  | "creative"
  | "mood-boost";

export type MoodPlaylistTimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface MoodPlaylistContext {
  activity?: MoodPlaylistActivity;
  timeOfDay?: MoodPlaylistTimeOfDay;
}

export interface MoodPlaylistRequest {
  mood: string;
  intensity?: number;
  durationMinutes?: number;
  preferences?: MoodPlaylistPreferences;
  context?: MoodPlaylistContext;
}

type RawMoodPlaylistResponse = {
  ok?: boolean;
  data?: any;
  error?: { message?: string };
};

const normalizeTrack = (track: any): MoodPlaylistTrack | null => {
  if (!isRecord(track)) return null;
  if (typeof track.id !== "string" || typeof track.title !== "string") return null;
  if (typeof track.artist !== "string" || typeof track.url !== "string") return null;
  const duration = typeof track.duration === "number" ? track.duration : 0;
  const mood = typeof track.mood === "string" ? track.mood : "";
  const energy = typeof track.energy === "number" ? track.energy : 0;
  const focus = typeof track.focus === "string" ? track.focus : "flow";

  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    url: track.url,
    duration,
    mood,
    energy,
    focus: focus as MoodPlaylistEnergyFocus,
    instrumentation: Array.isArray(track.instrumentation)
      ? track.instrumentation.filter((item: unknown): item is string => typeof item === "string")
      : [],
    tags: Array.isArray(track.tags)
      ? track.tags.filter((item: unknown): item is string => typeof item === "string")
      : [],
    description: typeof track.description === "string" ? track.description : "",
  };
};

const normalizeEnergyCurve = (segments: any): MoodPlaylistEnergySegment[] => {
  if (!Array.isArray(segments)) return [];
  return segments
    .map(segment => {
      if (!isRecord(segment)) return null;
      const trackId = typeof segment.track_id === "string" ? segment.track_id : undefined;
      if (!trackId) return null;
      return {
        trackId,
        start: typeof segment.start === "number" ? segment.start : 0,
        end: typeof segment.end === "number" ? segment.end : 0,
        energy: typeof segment.energy === "number" ? segment.energy : 0,
        focus: typeof segment.focus === "string"
          ? (segment.focus as MoodPlaylistEnergyFocus)
          : "flow",
      };
    })
    .filter((segment): segment is MoodPlaylistEnergySegment => Boolean(segment));
};

const normalizeEnergyProfile = (profile: any): MoodPlaylistEnergyProfile => {
  if (!isRecord(profile)) {
    return {
      baseline: 0,
      requested: null,
      recommended: 0,
      alignment: 0,
      curve: [],
    };
  }

  return {
    baseline: typeof profile.baseline === "number" ? profile.baseline : 0,
    requested: typeof profile.requested === "number" ? profile.requested : null,
    recommended: typeof profile.recommended === "number" ? profile.recommended : 0,
    alignment: typeof profile.alignment === "number" ? profile.alignment : 0,
    curve: normalizeEnergyCurve(profile.curve),
  };
};

const normalizeGuidance = (guidance: any): MoodPlaylistGuidance => {
  if (!isRecord(guidance)) {
    return {
      focus: "",
      breathwork: "",
      activities: [],
    };
  }

  return {
    focus: typeof guidance.focus === "string" ? guidance.focus : "",
    breathwork: typeof guidance.breathwork === "string" ? guidance.breathwork : "",
    activities: Array.isArray(guidance.activities)
      ? guidance.activities.filter((item: unknown): item is string => typeof item === "string")
      : [],
  };
};

const normalizeMetadata = (metadata: any): MoodPlaylistMetadata => {
  if (!isRecord(metadata)) {
    return {
      curatedBy: "",
      tags: [],
      datasetVersion: "",
    };
  }

  return {
    curatedBy: typeof metadata.curated_by === "string" ? metadata.curated_by : "",
    tags: Array.isArray(metadata.tags)
      ? metadata.tags.filter((item: unknown): item is string => typeof item === "string")
      : [],
    datasetVersion:
      typeof metadata.dataset_version === "string" ? metadata.dataset_version : "",
  };
};

const mapRequestToPayload = (request: MoodPlaylistRequest) => {
  const payload: Record<string, any> = {
    mood: request.mood,
  };

  if (typeof request.intensity === "number") {
    payload.intensity = Number(request.intensity.toFixed(2));
  }

  if (typeof request.durationMinutes === "number") {
    payload.duration_minutes = Math.round(request.durationMinutes);
  }

  if (request.preferences) {
    payload.preferences = {
      energy: request.preferences.energy,
      include_instrumental: request.preferences.includeInstrumental,
      include_vocals: request.preferences.includeVocals,
      instrumentation: Array.isArray(request.preferences.instrumentation)
        ? request.preferences.instrumentation.filter(
            (item): item is string => typeof item === "string"
          )
        : undefined,
    };
  }

  if (request.context) {
    payload.context = {
      activity: request.context.activity,
      time_of_day: request.context.timeOfDay,
    };
  }

  return payload;
};

const transformResponse = (raw: any): MoodPlaylistResult => {
  if (!isRecord(raw)) {
    throw new Error("Invalid playlist payload");
  }

  const tracks = Array.isArray(raw.tracks)
    ? raw.tracks
        .map(normalizeTrack)
        .filter((track): track is MoodPlaylistTrack => Boolean(track))
    : [];

  return {
    playlistId: typeof raw.playlist_id === "string" ? raw.playlist_id : "",
    mood: typeof raw.mood === "string" ? raw.mood : "",
    requestedMood: typeof raw.requested_mood === "string" ? raw.requested_mood : "",
    title: typeof raw.title === "string" ? raw.title : "",
    description: typeof raw.description === "string" ? raw.description : "",
    totalDuration: typeof raw.total_duration === "number" ? raw.total_duration : 0,
    unit: "seconds",
    tracks,
    energyProfile: normalizeEnergyProfile(raw.energy_profile),
    recommendations: Array.isArray(raw.recommendations)
      ? raw.recommendations.filter((item: unknown): item is string => typeof item === "string")
      : [],
    guidance: normalizeGuidance(raw.guidance),
    metadata: normalizeMetadata(raw.metadata),
  };
};

export async function requestMoodPlaylist(
  request: MoodPlaylistRequest
): Promise<MoodPlaylistResult> {
  const response = await fetch("/api/mood_playlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mapRequestToPayload(request)),
  });

  let payload: RawMoodPlaylistResponse | null = null;
  try {
    payload = (await response.json()) as RawMoodPlaylistResponse;
  } catch (error) {
    if (response.ok) {
      throw new Error("Le serveur n'a pas renvoyé de réponse valide");
    }
  }

  if (!response.ok) {
    const message = payload?.error?.message || response.statusText || "Requête échouée";
    throw new Error(message);
  }

  if (!payload?.ok || !payload.data) {
    throw new Error("Impossible de récupérer la playlist adaptive");
  }

  return transformResponse(payload.data);
}

