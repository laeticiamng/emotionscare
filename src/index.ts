import dotenv from "dotenv";
dotenv.config();

if (!process.env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = "test";
if (!process.env.MUSICGEN_API_KEY) process.env.MUSICGEN_API_KEY = "test";
if (!process.env.HUME_API_KEY) process.env.HUME_API_KEY = "test";

import { HumeClient } from "hume";
import OpenAI from "openai";

// ------- OPENAI GPT-4 -----------
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function openaiText(prompt: string) {
  const resp = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [{ role: "user", content: prompt }],
  });
  const answer = resp.choices[0]?.message?.content || "";
  console.log("\n--- OpenAI réponse ---\n", answer);
  return answer;
}

// ------- MUSICGEN V1/V2 -----------
async function musicgenLyrics(prompt: string) {
  const resp = await fetch("https://api.topmediai.com/v1/lyrics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.MUSICGEN_API_KEY!
    },
    body: JSON.stringify({ prompt }),
  });
  const data = await resp.json();
  console.log("\n--- MusicGen Lyrics ---\n", data);
  return data;
}

async function musicgenV1(prompt: string, lyrics?: string, title?: string) {
  const resp = await fetch("https://api.topmediai.com/v1/music", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.MUSICGEN_API_KEY!
    },
    body: JSON.stringify({
      is_auto: 1,
      prompt,
      lyrics: lyrics ?? "",
      title: title ?? prompt,
      instrumental: 0,
    }),
  });
  const data = await resp.json();
  console.log("\n--- MusicGen V1 ---\n", data);
  return data;
}

async function musicgenV2Submit(prompt: string, lyrics?: string) {
  const resp = await fetch("https://api.topmediai.com/v2/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.MUSICGEN_API_KEY!
    },
    body: JSON.stringify({
      is_auto: 1,
      prompt,
      lyrics: lyrics ?? "",
      title: "AI Music",
      instrumental: 0,
      model_version: "v3.5",
      continue_at: 0,
      continue_song_id: ""
    }),
  });
  const data = await resp.json();
  console.log("\n--- MusicGen V2 SUBMIT ---\n", data);
  return data;
}

async function musicgenV2Query(song_id: string) {
  const resp = await fetch(`https://api.topmediai.com/v2/query?song_id=${song_id}`, {
    method: "GET",
    headers: { "x-api-key": process.env.MUSICGEN_API_KEY! },
  });
  const data = await resp.json();
  console.log("\n--- MusicGen V2 QUERY ---\n", data);
  return data;
}

async function musicgenV2Concat(song_id: string) {
  const resp = await fetch("https://api.topmediai.com/v2/concat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.MUSICGEN_API_KEY!
    },
    body: JSON.stringify({ song_id }),
  });
  const data = await resp.json();
  console.log("\n--- MusicGen V2 CONCAT ---\n", data);
  return data;
}

// ------- HUME TTS ---------

// ------- HUME Batch ---------
async function humeBatchJob(urls: string[]) {
  const resp = await fetch("https://api.hume.ai/v0/batch/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Hume-Api-Key": process.env.HUME_API_KEY!
    },
    body: JSON.stringify({ models: { face: {} }, urls }),
  });
  return resp.json();
}
async function humeBatchJobStatus(id: string) {
  const resp = await fetch(`https://api.hume.ai/v0/batch/jobs/${id}`, {
    headers: { "X-Hume-Api-Key": process.env.HUME_API_KEY! },
  });
  return resp.json();
}

// -------------- Exports ----------------
const hume = new HumeClient({ apiKey: process.env.HUME_API_KEY! });

export {
  openaiText,
  musicgenLyrics,
  musicgenV1,
  musicgenV2Submit,
  musicgenV2Query,
  musicgenV2Concat,
  humeBatchJob,
  humeBatchJobStatus,
  hume,
};
