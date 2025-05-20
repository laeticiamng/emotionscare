import dotenv from "dotenv";
dotenv.config();

import fs from "fs/promises";
import path from "path";
import os from "os";
import child_process from "child_process";
import fetch from "node-fetch";
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
const outputDir = path.join(os.tmpdir(), `hume-audio-${Date.now()}`);
async function writeResultToFile(base64: string, name: string) {
  await fs.mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, `${name}.wav`);
  await fs.writeFile(filePath, Buffer.from(base64, "base64"));
  console.log("Wrote", filePath);
}

function startAudioPlayer() {
  const proc = child_process.spawn(
    "ffplay",
    ["-nodisp", "-autoexit", "-infbuf", "-i", "-"],
    { detached: true, stdio: ["pipe", "ignore", "ignore"] }
  );
  proc.on("error", (err: any) => {
    if (err.code === "ENOENT")
      console.error("⚠ ffplay not found (ffmpeg). Audio playback skipped.");
  });
  return {
    sendAudio: (audio: string) => proc.stdin.write(Buffer.from(audio, "base64")),
    stop: () => {
      proc.stdin.end();
      proc.unref();
    },
  };
}

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

// -------------- MAIN DEMO ----------------
const hume = new HumeClient({ apiKey: process.env.HUME_API_KEY! });

async function main() {
  await openaiText("Rédige-moi une idée de chanson pop positive pour l'été.");
  await musicgenV1("Happy summer pop", "Soleil, musique, danse, tout l'été!");
  await musicgenLyrics("Sad ballad with hope");

  const v2 = await musicgenV2Submit("French electro groove", "Danse sur la plage toute la nuit");
  const songId = v2.song_id || v2.data?.song_id;
  if (songId) {
    await musicgenV2Query(songId);
    await musicgenV2Concat(songId);
  }

  const speech = await hume.tts.synthesizeJson({
    utterances: [{ description: "A refined, British aristocrat", text: "Take an arrow from the quiver." }]
  });
  await writeResultToFile(speech.generations[0].audio, "speech1_0");

  const batch = await humeBatchJob(["https://hume-tutorials.s3.amazonaws.com/faces.zip"]);
  if (batch.job_id) await humeBatchJobStatus(batch.job_id);
}

main().then(() => console.log("Done")).catch(console.error);
